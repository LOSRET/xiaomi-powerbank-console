import type {
  BatteryIdInfo,
  BatteryInfo,
  CellStatus,
  HelloInfo,
  HistoryRecord,
  ProtocolLogEntry,
  Qi2EnableResult,
  Qi2Status,
  TempModelInfo,
} from '@/types/device'
import { CMD, RESPONSE_CMD, TIMEOUT } from '@/lib/protocol/constants'
import {
  buildCommandFrame,
  buildHelloFrame,
  bytesToHex,
  extractFrames,
} from '@/lib/protocol/frames'
import {
  decodeBatteryId,
  decodeBatteryInfo,
  decodeCellStatus,
  decodeHello,
  decodeHistoryBatch,
  decodeQi2Enable,
  decodeQi2Status,
  decodeTempModel,
} from '@/lib/protocol/decoders'
import type { ParsedFrame } from '@/lib/protocol/types'
import type { HidTransport } from './transport'

type LogInput = Omit<ProtocolLogEntry, 'id' | 'at'>
type PendingResponse = {
  expected: number
  resolve: (payload: Uint8Array) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

export interface DeviceClientEvents {
  onLog?: (entry: LogInput) => void
  onDisconnect?: () => void
  onFrame?: (frame: ParsedFrame) => void
}

const CMD_LABELS: Record<number, string> = {
  [CMD.HELLO]: 'Hello',
  [CMD.GET_BATTERY_INFO]: 'Get battery info',
  [CMD.GET_CELL_STATUS]: 'Get cell status',
  [CMD.GET_HISTORY]: 'Get history',
  [CMD.GET_BATTERY_ID]: 'Get cell id',
  [CMD.DISCONNECT]: 'Disconnect',
  [CMD.ENABLE_QI2]: 'Set Qi2.2',
  [CMD.GET_QI2_STATUS]: 'Get Qi2.2 status',
  [CMD.HEARTBEAT]: 'Heartbeat',
  [CMD.GET_CELL_TEMP_MODEL]: 'Get temperature model',
  [RESPONSE_CMD.HELLO]: 'Hello response',
  [RESPONSE_CMD.BATTERY_INFO]: 'Battery response',
  [RESPONSE_CMD.CELL_STATUS]: 'Cell status response',
  [RESPONSE_CMD.HISTORY]: 'History response',
  [RESPONSE_CMD.BATTERY_ID]: 'Cell id response',
  [RESPONSE_CMD.ENABLE_QI2]: 'Qi2.2 set response',
  [RESPONSE_CMD.QI2_STATUS]: 'Qi2.2 status response',
  [RESPONSE_CMD.CELL_TEMP_MODEL]: 'Temperature model response',
}

export class DeviceClient {
  private readonly transport: HidTransport
  private readonly events: DeviceClientEvents
  private readonly pending = new Map<number, PendingResponse>()
  private inputBuffer: Uint8Array<ArrayBufferLike> = new Uint8Array()
  private detachReport: (() => void) | null = null
  private detachDisconnect: (() => void) | null = null
  private opened = false

  constructor(transport: HidTransport, events: DeviceClientEvents = {}) {
    this.transport = transport
    this.events = events
  }

  async open(): Promise<void> {
    await this.transport.open()
    this.opened = true
    this.detachReport = this.transport.onInputReport((data) => this.handleReport(data))
    this.detachDisconnect = this.transport.onDisconnect(() => this.handleDisconnect())
    this.log({
      direction: 'info',
      label: 'HID session opened',
      detail: `VID 0x${this.transport.info.vendorId.toString(16).toUpperCase()} · PID 0x${this.transport.info.productId.toString(16).toUpperCase()}`,
    })
  }

  async close(): Promise<void> {
    this.rejectAll(new Error('Session closed'))
    this.detachReport?.()
    this.detachDisconnect?.()
    this.detachReport = null
    this.detachDisconnect = null
    this.opened = false
    this.inputBuffer = new Uint8Array()
    await this.transport.close()
  }

  async handshake(): Promise<HelloInfo> {
    const payload = await this.requestRaw(
      CMD.HELLO,
      RESPONSE_CMD.HELLO,
      TIMEOUT.HELLO,
      buildHelloFrame(),
      'Hello',
    )
    return decodeHello(payload)
  }

  async getBatteryInfo(): Promise<BatteryInfo> {
    const payload = await this.request(
      CMD.GET_BATTERY_INFO,
      RESPONSE_CMD.BATTERY_INFO,
      TIMEOUT.COMMAND,
    )
    return decodeBatteryInfo(payload)
  }

  async getCellStatus(cellCount: number): Promise<CellStatus[]> {
    if (cellCount <= 0) return []
    const count = Math.min(255, cellCount)
    const payload = new Uint8Array([1, count])
    const response = await this.request(
      CMD.GET_CELL_STATUS,
      RESPONSE_CMD.CELL_STATUS,
      TIMEOUT.COMMAND,
      payload,
    )
    return decodeCellStatus(response)
  }

  async getBatteryId(index: number): Promise<BatteryIdInfo> {
    const payload = new Uint8Array([index])
    const response = await this.request(
      CMD.GET_BATTERY_ID,
      RESPONSE_CMD.BATTERY_ID,
      TIMEOUT.BATTERY_ID,
      payload,
    )
    return decodeBatteryId(response)
  }

  async getTempModel(): Promise<TempModelInfo> {
    const payload = await this.request(
      CMD.GET_CELL_TEMP_MODEL,
      RESPONSE_CMD.CELL_TEMP_MODEL,
      TIMEOUT.COMMAND,
    )
    return decodeTempModel(payload)
  }

  async getQi2Status(): Promise<Qi2Status> {
    const payload = await this.request(CMD.GET_QI2_STATUS, RESPONSE_CMD.QI2_STATUS, TIMEOUT.COMMAND)
    return decodeQi2Status(payload)
  }

  async setQi2(enabled: boolean): Promise<Qi2EnableResult> {
    const payload = new Uint8Array([enabled ? 1 : 0])
    const response = await this.request(
      CMD.ENABLE_QI2,
      RESPONSE_CMD.ENABLE_QI2,
      TIMEOUT.QI2_WRITE,
      payload,
    )
    return decodeQi2Enable(response)
  }

  async getHistory(start: number, end: number): Promise<HistoryRecord[]> {
    const payload = new Uint8Array(4)
    payload[0] = start & 0xff
    payload[1] = (start >>> 8) & 0xff
    payload[2] = end & 0xff
    payload[3] = (end >>> 8) & 0xff
    const response = await this.request(
      CMD.GET_HISTORY,
      RESPONSE_CMD.HISTORY,
      TIMEOUT.HISTORY,
      payload,
    )
    return decodeHistoryBatch(response).records
  }

  async sendHeartbeat(): Promise<void> {
    if (!this.opened) return
    const frame = buildHelloFrame()
    this.log({
      direction: 'tx',
      label: 'Heartbeat',
      hex: bytesToHex(frame, true),
    })
    try {
      await this.transport.send(frame)
    } catch (error) {
      this.log({
        direction: 'error',
        label: 'Heartbeat failed',
        detail: error instanceof Error ? error.message : String(error),
      })
      this.handleDisconnect()
    }
  }

  async disconnect(): Promise<void> {
    if (!this.opened) return
    try {
      const frame = buildCommandFrame(CMD.DISCONNECT)
      this.log({ direction: 'tx', label: 'Disconnect', hex: bytesToHex(frame, true) })
      await this.transport.send(frame)
      await new Promise((resolve) => setTimeout(resolve, 30))
    } catch {
      // The cable may already be gone.
    }
    await this.close()
  }

  private async request(
    command: number,
    expected: number,
    timeout: number,
    payload = new Uint8Array(),
  ): Promise<Uint8Array> {
    const frame = buildCommandFrame(command, payload)
    return this.requestRaw(
      command,
      expected,
      timeout,
      frame,
      CMD_LABELS[command] ?? `CMD 0x${command.toString(16)}`,
    )
  }

  private async requestRaw(
    command: number,
    expected: number,
    timeout: number,
    frame: Uint8Array<ArrayBufferLike>,
    label: string,
  ): Promise<Uint8Array> {
    if (!this.opened && command !== CMD.DISCONNECT) {
      throw new Error('Device is not connected')
    }
    if (this.pending.has(expected)) {
      throw new Error(`A request for response 0x${expected.toString(16)} is already pending`)
    }

    const response = new Promise<Uint8Array>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(expected)
        reject(new Error(`Request timed out after ${timeout} ms`))
      }, timeout)

      this.pending.set(expected, { expected, resolve, reject, timer })
    })
    // Keep a handler attached for the case where send() fails and the caller
    // receives that error instead of this promise.
    void response.catch(() => undefined)

    this.log({ direction: 'tx', label, hex: bytesToHex(frame, true) })
    try {
      await this.transport.send(frame)
    } catch (error) {
      this.rejectPending(expected, error instanceof Error ? error : new Error(String(error)))
      throw error
    }
    return response
  }

  private handleReport(data: Uint8Array<ArrayBufferLike>): void {
    if (!this.opened) return
    const merged = new Uint8Array(this.inputBuffer.length + data.length)
    merged.set(this.inputBuffer)
    merged.set(data, this.inputBuffer.length)
    const { frames, remaining } = extractFrames(merged)
    this.inputBuffer = remaining.length > 1024 ? new Uint8Array() : remaining

    for (const frame of frames) {
      this.events.onFrame?.(frame)
      this.log({
        direction: 'rx',
        label:
          CMD_LABELS[frame.command] ?? `Response 0x${frame.command.toString(16).toUpperCase()}`,
        hex: bytesToHex(frame.raw, true),
        detail: frame.crcValid
          ? `${frame.dataLength} bytes`
          : `CRC mismatch (received 0x${frame.checksum.toString(16).toUpperCase()}, expected 0x${frame.expectedChecksum.toString(16).toUpperCase()})`,
      })

      if (!frame.crcValid) {
        this.rejectPending(frame.command, new Error('CRC check failed'))
        continue
      }

      const pending = this.pending.get(frame.command)
      if (pending) {
        clearTimeout(pending.timer)
        this.pending.delete(frame.command)
        pending.resolve(frame.payload)
      }
    }
  }

  private handleDisconnect(): void {
    if (!this.opened) return
    this.opened = false
    this.rejectAll(new Error('Device disconnected'))
    this.events.onDisconnect?.()
  }

  private rejectPending(command: number, error: Error): void {
    const pending = this.pending.get(command)
    if (!pending) return
    clearTimeout(pending.timer)
    this.pending.delete(command)
    pending.reject(error)
  }

  private rejectAll(error: Error): void {
    for (const [command, pending] of this.pending) {
      clearTimeout(pending.timer)
      pending.reject(error)
      this.pending.delete(command)
    }
  }

  private log(entry: LogInput): void {
    this.events.onLog?.(entry)
  }
}
