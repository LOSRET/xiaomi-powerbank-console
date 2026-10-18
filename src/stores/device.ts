import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type {
  BatteryIdInfo,
  BatteryInfo,
  CellStatus,
  ConnectionStatus,
  DeviceIdentity,
  HelloInfo,
  HistoryRecord,
  ProtocolLogEntry,
  TempModelInfo,
} from '@/types/device'
import { DeviceClient } from '@/lib/hid/device-client'
import { MockTransport } from '@/lib/hid/mock-transport'
import { WebHidTransport } from '@/lib/hid/webhid-transport'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { chargeStateKey } from '@/lib/protocol/decoders'

const HISTORY_PAGE_SIZE = 7
const MAX_HISTORY = 100
const HEARTBEAT_INTERVAL = 15_000
const WPB1007ZX_CUTOFF = 1_772_323_200

interface ErrorModal {
  title: string
  body: string
}

export const useDeviceStore = defineStore('device', () => {
  const { t } = useI18n()
  const toast = useToast()
  const isSupported = WebHidTransport.isSupported()

  const status = ref<ConnectionStatus>('idle')
  const transportKind = ref<'webhid' | 'demo' | null>(null)
  const device = ref<DeviceIdentity | null>(null)
  const hello = ref<HelloInfo | null>(null)
  const battery = ref<BatteryInfo | null>(null)
  const cells = ref<CellStatus[]>([])
  const cellIds = ref<Record<number, BatteryIdInfo>>({})
  const tempModel = ref<TempModelInfo | null>(null)
  const history = ref<HistoryRecord[]>([])
  const historyLoaded = ref(false)
  const historyLoading = ref(false)
  const refreshing = ref(false)
  const dataError = ref(false)
  const lastUpdated = ref(0)
  const logs = ref<ProtocolLogEntry[]>([])
  const crcErrors = ref(0)
  const protocolOpen = ref(false)
  const disconnectConfirmOpen = ref(false)
  const disconnectedModalOpen = ref(false)
  const unauthorizedModalOpen = ref(false)
  const errorModal = ref<ErrorModal | null>(null)

  const client = shallowRef<DeviceClient | null>(null)
  let heartbeatTimer: number | null = null
  let heartbeatWorker: Worker | null = null
  let logId = 0
  let wakeLock: WakeLockSentinel | null = null
  let manualDisconnect = false
  let idsLoading = false
  let idsLoadedCellCount = 0
  let lastHistoryCount = -1

  const isConnected = computed(() => status.value === 'connected' || status.value === 'demo')
  const isDemo = computed(() => status.value === 'demo')
  const activeModel = computed(() => hello.value?.model ?? null)
  const isWPB1007ZX = computed(() => activeModel.value?.model === 'WPB1007ZX')
  const modelId = computed(() => hello.value?.modelId ?? 0)
  const productName = computed(() => {
    if (device.value?.displayName) return device.value.displayName
    return device.value?.productName || t('dashboard.modelUnknown')
  })
  const productNameEn = computed(() => {
    if (device.value?.displayNameEn) return device.value.displayNameEn
    return device.value?.productName || 'Unknown model'
  })
  const serialNumber = computed(() => hello.value?.serialNumber ?? '')
  const chargeStateLabelKey = computed(() =>
    battery.value ? chargeStateKey(battery.value.chargeState) : 'status.unknown',
  )
  const temperatureRange = computed(() => {
    if (tempModel.value?.success && tempModel.value.range !== '--') return tempModel.value.range
    return activeModel.value?.tempRange ?? '-20℃~60℃'
  })
  const temperatureSensors = computed(() => {
    const withSensors = cells.value.filter((cell) => cell.hasTemperatureSensor)
    return isWPB1007ZX.value ? withSensors.filter((cell) => cell.index === 1) : withSensors
  })
  const batteryModel = computed(() => {
    const firstId = Object.values(cellIds.value).find((id) => id.parsed)
    return tempModel.value?.batteryModel || firstId?.parsed?.miCodeInfo.cellModel || '--'
  })
  const batteryManufacturer = computed(() => {
    const parsed = Object.values(cellIds.value).find((id) => id.parsed)?.parsed
    return parsed?.fixed.assemblyFactory ?? '--'
  })
  const batteryManufacturerEn = computed(() => {
    const parsed = Object.values(cellIds.value).find((id) => id.parsed)?.parsed
    return parsed?.fixed.assemblyFactoryEn ?? '--'
  })
  const historySorted = computed(() =>
    [...history.value].sort((left, right) => right.timestamp - left.timestamp),
  )
  const frameCount = computed(
    () => logs.value.filter((entry) => entry.direction === 'tx' || entry.direction === 'rx').length,
  )
  const logsForCopy = computed(() =>
    logs.value
      .map((entry) => {
        const direction = entry.direction.toUpperCase()
        return `[${new Date(entry.at).toISOString()}] ${direction} ${entry.label}${entry.hex ? `\n${entry.hex}` : ''}`
      })
      .join('\n'),
  )

  function addLog(entry: Omit<ProtocolLogEntry, 'id' | 'at'>): void {
    logId += 1
    const next: ProtocolLogEntry = { ...entry, id: logId, at: Date.now() }
    logs.value = [...logs.value, next].slice(-300)
  }

  function resetData(): void {
    device.value = null
    hello.value = null
    battery.value = null
    cells.value = []
    cellIds.value = {}
    tempModel.value = null
    history.value = []
    historyLoaded.value = false
    dataError.value = false
    lastUpdated.value = 0
    idsLoadedCellCount = 0
    lastHistoryCount = -1
  }

  function stopHeartbeat(): void {
    if (heartbeatTimer !== null) {
      window.clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    if (heartbeatWorker) {
      heartbeatWorker.terminate()
      heartbeatWorker = null
    }
  }

  function startHeartbeat(): void {
    stopHeartbeat()
    if (transportKind.value !== 'webhid') return

    // A worker keeps ticking when the tab is in the background, where normal
    // timers are throttled. The original page uses the same strategy.
    try {
      heartbeatWorker = new Worker(new URL('../lib/hid/heartbeat.worker.ts', import.meta.url), {
        type: 'module',
      })
      heartbeatWorker.onmessage = () => {
        void client.value?.sendHeartbeat()
      }
      heartbeatWorker.postMessage({ type: 'start', interval: HEARTBEAT_INTERVAL })
    } catch {
      heartbeatTimer = window.setInterval(() => {
        void client.value?.sendHeartbeat()
      }, HEARTBEAT_INTERVAL)
    }
  }

  async function requestWakeLock(): Promise<void> {
    if (!('wakeLock' in navigator) || wakeLock) return
    try {
      wakeLock = await navigator.wakeLock.request('screen')
      wakeLock.addEventListener('release', () => {
        wakeLock = null
      })
    } catch {
      // Wake locks are optional and can be rejected by the OS.
    }
  }

  async function releaseWakeLock(): Promise<void> {
    if (!wakeLock) return
    try {
      await wakeLock.release()
    } catch {
      // Already released.
    }
    wakeLock = null
  }

  async function startSession(transport: WebHidTransport | MockTransport): Promise<boolean> {
    const isDemoSession = transport.kind === 'demo'
    transportKind.value = transport.kind
    logs.value = []
    crcErrors.value = 0
    manualDisconnect = false
    status.value = 'connecting'

    const nextClient = new DeviceClient(transport, {
      onLog: addLog,
      onFrame: (frame) => {
        if (!frame.crcValid) crcErrors.value += 1
      },
      onDisconnect: handleUnexpectedDisconnect,
    })
    client.value = nextClient

    try {
      await nextClient.open()
      const helloInfo = await nextClient.handshake()
      hello.value = helloInfo

      const model = helloInfo.model
      device.value = {
        productName: transport.info.productName,
        vendorId: transport.info.vendorId,
        productId: transport.info.productId,
        modelId: helloInfo.modelId,
        model: model?.model ?? '--',
        serialNumber: helloInfo.serialNumber,
        displayName: model?.name ?? transport.info.productName,
        displayNameEn: model?.nameEn ?? transport.info.productName,
      }

      status.value = isDemoSession ? 'demo' : 'connected'
      await requestWakeLock()
      await refreshData({ initial: true })
      startHeartbeat()
      toast.success(t(isDemoSession ? 'toast.demoLoaded' : 'toast.connected'))
      return true
    } catch (error) {
      await nextClient.close().catch(() => undefined)
      if (client.value === nextClient) client.value = null
      status.value = 'idle'
      hello.value = null
      device.value = null
      unauthorizedModalOpen.value = true
      addLog({
        direction: 'error',
        label: 'Handshake failed',
        detail: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  async function connect(): Promise<void> {
    if (status.value === 'connecting') return
    if (!isSupported) {
      status.value = 'unavailable'
      toast.error(t('error.unsupported'))
      return
    }

    try {
      const transport = await WebHidTransport.request()
      if (!transport) {
        status.value = 'idle'
        toast.show(t('toast.noDevice'))
        return
      }
      await startSession(transport)
    } catch (error) {
      status.value = 'idle'
      toast.error(t('toast.handshakeFailed'))
      addLog({
        direction: 'error',
        label: 'Device request failed',
        detail: error instanceof Error ? error.message : String(error),
      })
    }
  }

  async function connectDemo(): Promise<void> {
    if (status.value === 'connecting') return
    const transport = new MockTransport()
    await startSession(transport)
  }

  async function refreshData({ initial = false } = {}): Promise<void> {
    const activeClient = client.value
    if (!activeClient || refreshing.value || !isConnected.value) return

    refreshing.value = true
    dataError.value = false
    try {
      const nextBattery = await withRetry(() => activeClient.getBatteryInfo(), 2, 400)
      battery.value = nextBattery
      lastUpdated.value = Date.now()

      if (nextBattery.cellCount > 0) {
        try {
          cells.value = await withRetry(
            () => activeClient.getCellStatus(nextBattery.cellCount),
            2,
            350,
          )
        } catch {
          cells.value = []
          if (!initial) toast.error(t('toast.commandFailed'))
        }
      } else {
        cells.value = []
      }

      // Only newer models expose the temperature-threshold/model command.
      if (modelId.value > 14 || transportKind.value === 'demo') {
        try {
          tempModel.value = await activeClient.getTempModel()
        } catch {
          tempModel.value = null
        }
      }

      if (nextBattery.cellCount !== idsLoadedCellCount) {
        cellIds.value = {}
        idsLoadedCellCount = 0
      }
      if (nextBattery.cellCount > 0) {
        await loadCellIds(activeClient, nextBattery.cellCount)
      }

      if (nextBattery.historyErrorCount !== lastHistoryCount) {
        historyLoaded.value = false
        lastHistoryCount = nextBattery.historyErrorCount
      }

      if (initial) {
        lastUpdated.value = Date.now()
      }
    } catch (error) {
      if (initial) {
        dataError.value = true
        toast.error(t('toast.commandFailed'))
      } else {
        toast.error(t('toast.refreshFailed'))
      }
      addLog({
        direction: 'error',
        label: 'Refresh failed',
        detail: error instanceof Error ? error.message : String(error),
      })
    } finally {
      refreshing.value = false
    }
  }

  async function loadCellIds(activeClient: DeviceClient, cellCount: number): Promise<void> {
    if (idsLoading) return
    idsLoading = true
    try {
      for (let index = 1; index <= Math.min(cellCount, 8); index += 1) {
        if (cellIds.value[index]?.raw) continue
        try {
          const id = await withRetry(() => activeClient.getBatteryId(index), 2, 250)
          if (id.raw) {
            cellIds.value = { ...cellIds.value, [index]: id }
          }
        } catch {
          // Some firmware revisions do not expose cell identifiers.
        }
        await delay(30)
      }
      idsLoadedCellCount = cellCount
    } finally {
      idsLoading = false
    }
  }

  async function loadHistory(): Promise<void> {
    const activeClient = client.value
    if (!activeClient || !battery.value || historyLoading.value) return
    if (historyLoaded.value) return

    const total = Math.min(MAX_HISTORY, battery.value.historyErrorCount)
    if (total <= 0) {
      history.value = []
      historyLoaded.value = true
      return
    }

    historyLoading.value = true
    const collected: HistoryRecord[] = []
    try {
      for (let start = 1; start <= total; start += HISTORY_PAGE_SIZE) {
        const end = Math.min(total, start + HISTORY_PAGE_SIZE - 1)
        const batch = await withRetry(() => activeClient.getHistory(start, end), 2, 300)
        collected.push(...batch)
        await delay(120)
      }

      const source = isWPB1007ZX.value
        ? collected.filter((record) => record.timestamp >= WPB1007ZX_CUTOFF)
        : collected
      history.value = source
        .sort((left, right) => right.timestamp - left.timestamp)
        .slice(0, MAX_HISTORY)
      historyLoaded.value = true
    } catch (error) {
      toast.error(t('toast.historyFailed'))
      addLog({
        direction: 'error',
        label: 'History request failed',
        detail: error instanceof Error ? error.message : String(error),
      })
    } finally {
      historyLoading.value = false
    }
  }

  async function stopSession(manual: boolean): Promise<void> {
    manualDisconnect = manual
    stopHeartbeat()
    await releaseWakeLock()
    const activeClient = client.value
    client.value = null
    if (activeClient) {
      if (manual) {
        await activeClient.disconnect().catch(() => undefined)
      } else {
        await activeClient.close().catch(() => undefined)
      }
    }
    resetData()
    transportKind.value = null
    status.value = 'idle'
  }

  async function confirmDisconnect(): Promise<void> {
    disconnectConfirmOpen.value = false
    await stopSession(true)
    toast.show(t('toast.disconnected'))
  }

  function requestDisconnect(): void {
    disconnectConfirmOpen.value = true
  }

  async function exitDemo(): Promise<void> {
    await stopSession(true)
    toast.show(t('toast.demoExited'))
  }

  async function handleUnexpectedDisconnect(): Promise<void> {
    if (manualDisconnect) return
    const wasDemo = status.value === 'demo'
    await stopSession(false)
    status.value = 'idle'
    disconnectedModalOpen.value = true
    if (wasDemo) toast.show(t('toast.demoExited'))
  }

  function clearLogs(): void {
    logs.value = []
    crcErrors.value = 0
    toast.show(t('toast.protocolCleared'))
  }

  function openProtocolLog(): void {
    protocolOpen.value = true
  }

  function closeProtocolLog(): void {
    protocolOpen.value = false
  }

  function setErrorModal(title: string, body: string): void {
    errorModal.value = { title, body }
  }

  function closeErrorModal(): void {
    errorModal.value = null
  }

  function dismissDisconnectedModal(): void {
    disconnectedModalOpen.value = false
  }

  function dismissUnauthorizedModal(): void {
    unauthorizedModalOpen.value = false
  }

  return {
    // state
    status,
    transportKind,
    isSupported,
    device,
    hello,
    battery,
    cells,
    cellIds,
    tempModel,
    history: historySorted,
    historyLoaded,
    historyLoading,
    refreshing,
    dataError,
    lastUpdated,
    logs,
    crcErrors,
    protocolOpen,
    disconnectConfirmOpen,
    disconnectedModalOpen,
    unauthorizedModalOpen,
    errorModal,
    // computed
    isConnected,
    isDemo,
    activeModel,
    isWPB1007ZX,
    modelId,
    productName,
    productNameEn,
    serialNumber,
    chargeStateLabelKey,
    temperatureRange,
    temperatureSensors,
    batteryModel,
    batteryManufacturer,
    batteryManufacturerEn,
    frameCount,
    logsForCopy,
    // actions
    connect,
    connectDemo,
    refreshData,
    loadHistory,
    requestDisconnect,
    confirmDisconnect,
    exitDemo,
    clearLogs,
    openProtocolLog,
    closeProtocolLog,
    setErrorModal,
    closeErrorModal,
    dismissDisconnectedModal,
    dismissUnauthorizedModal,
  }
})

async function withRetry<T>(
  operation: () => Promise<T>,
  attempts: number,
  wait: number,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (attempt < attempts) await delay(wait * 2 ** (attempt - 1))
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
