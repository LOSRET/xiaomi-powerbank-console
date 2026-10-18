import type { TransportInfo } from '@/types/device'
import { CMD, RESPONSE_CMD } from '@/lib/protocol/constants'
import { buildCommandFrame, parseFrame } from '@/lib/protocol/frames'
import type { HidTransport } from './transport'

const DEMO_SERIAL = 'DMPB1025S0001'
const DEMO_CELL_IDS = ['ATLNDAG3F-1D9A26A0123', 'LWN2AFG3F-1MFH26B0456']

interface DemoHistoryRow {
  timestamp: number
  cellId: number
  chargeState: number
  errorType: number
  value: number
}

function asciiBytes(value: string, length: number): Uint8Array {
  const result = new Uint8Array(length)
  const encoded = new TextEncoder().encode(value)
  result.set(encoded.subarray(0, length))
  return result
}

function writeUInt16LE(target: Uint8Array, offset: number, value: number): void {
  target[offset] = value & 0xff
  target[offset + 1] = (value >>> 8) & 0xff
}

function writeUInt32LE(target: Uint8Array, offset: number, value: number): void {
  target[offset] = value & 0xff
  target[offset + 1] = (value >>> 8) & 0xff
  target[offset + 2] = (value >>> 16) & 0xff
  target[offset + 3] = (value >>> 24) & 0xff
}

function demoHistory(): DemoHistoryRow[] {
  return [
    {
      timestamp: Math.floor(Date.UTC(2026, 8, 12, 14, 32) / 1000),
      cellId: 1,
      chargeState: 0x40,
      errorType: 3,
      value: 46,
    },
    {
      timestamp: Math.floor(Date.UTC(2026, 7, 28, 20, 11) / 1000),
      cellId: 2,
      chargeState: 0x00,
      errorType: 3,
      value: 44,
    },
    {
      timestamp: Math.floor(Date.UTC(2026, 6, 3, 9, 5) / 1000),
      cellId: 1,
      chargeState: 0x40,
      errorType: 1,
      value: 4380,
    },
  ]
}

export class MockTransport implements HidTransport {
  readonly kind = 'demo' as const
  readonly info: TransportInfo = {
    productName: 'XiaomiPowerBank (Demo)',
    vendorId: 0x2717,
    productId: 0x0001,
    serialNumber: DEMO_SERIAL,
  }

  private opened = false
  private tick = 0
  private qi2Enabled = false
  private readonly reportListeners = new Set<(data: Uint8Array) => void>()
  private readonly disconnectListeners = new Set<() => void>()
  private readonly history = demoHistory()

  async open(): Promise<void> {
    this.opened = true
  }

  async close(): Promise<void> {
    this.opened = false
  }

  async send(frame: Uint8Array): Promise<void> {
    if (!this.opened) throw new Error('Demo device is not open')
    const parsed = parseFrame(frame, false)

    // Simulate the time it takes the power bank firmware to answer.
    await new Promise((resolve) => setTimeout(resolve, 18 + Math.floor(Math.random() * 24)))
    if (!this.opened) return

    switch (parsed.command) {
      case CMD.HELLO:
      case CMD.HEARTBEAT:
        this.emit(RESPONSE_CMD.HELLO, this.helloPayload())
        break
      case CMD.GET_BATTERY_INFO:
        this.emit(RESPONSE_CMD.BATTERY_INFO, this.batteryPayload())
        break
      case CMD.GET_CELL_STATUS:
        this.emit(RESPONSE_CMD.CELL_STATUS, this.cellPayload())
        break
      case CMD.GET_BATTERY_ID: {
        const index = parsed.payload[0] ?? 1
        this.emit(RESPONSE_CMD.BATTERY_ID, this.batteryIdPayload(index))
        break
      }
      case CMD.GET_CELL_TEMP_MODEL:
        this.emit(RESPONSE_CMD.CELL_TEMP_MODEL, this.tempModelPayload())
        break
      case CMD.GET_QI2_STATUS:
        this.emit(RESPONSE_CMD.QI2_STATUS, new Uint8Array([0, this.qi2Enabled ? 1 : 0]))
        break
      case CMD.ENABLE_QI2:
        this.qi2Enabled = parsed.payload[0] === 1
        this.emit(RESPONSE_CMD.ENABLE_QI2, new Uint8Array([0]))
        break
      case CMD.GET_HISTORY:
        this.emit(RESPONSE_CMD.HISTORY, this.historyPayload(parsed.payload))
        break
      default:
        break
    }
  }

  onInputReport(listener: (data: Uint8Array) => void): () => void {
    this.reportListeners.add(listener)
    return () => this.reportListeners.delete(listener)
  }

  onDisconnect(listener: () => void): () => void {
    this.disconnectListeners.add(listener)
    return () => this.disconnectListeners.delete(listener)
  }

  /** Used by the demo UI to show the unplug flow. */
  simulateDisconnect(): void {
    this.opened = false
    for (const listener of this.disconnectListeners) listener()
  }

  private emit(command: number, payload: Uint8Array<ArrayBufferLike>): void {
    const frame = buildCommandFrame(command, payload)
    for (const listener of this.reportListeners) listener(frame)
  }

  private helloPayload(): Uint8Array {
    const payload = new Uint8Array(23)
    writeUInt16LE(payload, 0, 9)
    payload.set(asciiBytes(DEMO_SERIAL, 20), 2)
    payload[22] = 1
    return payload
  }

  private batteryPayload(): Uint8Array {
    this.tick += 1
    const payload = new Uint8Array(18)
    payload[0] = 0
    payload[1] = 1
    writeUInt16LE(payload, 2, 37)
    writeUInt16LE(payload, 4, 97)
    payload[6] = 0x40
    writeUInt16LE(payload, 7, 0)
    writeUInt16LE(payload, 9, this.history.length)
    payload[11] = 0x12
    payload[12] = 86
    payload[13] = 29 + (this.tick % 2)
    writeUInt16LE(payload, 14, 7700 + (this.tick % 3) * 4)
    writeUInt16LE(payload, 16, 1180 + (this.tick % 4) * 12)
    return payload
  }

  private cellPayload(): Uint8Array {
    const payload = new Uint8Array(1 + 2 * 5)
    payload[0] = 0
    const cells = [
      { temp: 29, voltage: 3852, current: 602 },
      { temp: 30, voltage: 3848, current: 610 },
    ]
    cells.forEach((cell, index) => {
      const offset = 1 + index * 5
      payload[offset] = cell.temp
      writeUInt16LE(payload, offset + 1, cell.voltage)
      writeUInt16LE(payload, offset + 3, cell.current)
    })
    return payload
  }

  private batteryIdPayload(index: number): Uint8Array {
    const raw = DEMO_CELL_IDS[index - 1] ?? ''
    const payload = new Uint8Array(2 + raw.length)
    payload[0] = raw ? 0 : 1
    payload[1] = index
    payload.set(asciiBytes(raw, raw.length), 2)
    return payload
  }

  private tempModelPayload(): Uint8Array {
    const model = asciiBytes('436678B', 7)
    const payload = new Uint8Array(5 + model.length)
    payload[0] = 0
    writeUInt16LE(payload, 1, 60)
    writeUInt16LE(payload, 3, -20)
    payload.set(model, 5)
    return payload
  }

  private historyPayload(request: Uint8Array): Uint8Array {
    const start = (request[0] ?? 0) | ((request[1] ?? 0) << 8)
    const end = (request[2] ?? 0) | ((request[3] ?? 0) << 8)
    const rows = this.history.slice(Math.max(0, start - 1), Math.max(0, end))
    const payload = new Uint8Array(1 + rows.length * 8)
    payload[0] = 0

    rows.forEach((row, index) => {
      const offset = 1 + index * 8
      writeUInt32LE(payload, offset, row.timestamp)
      payload[offset + 4] = row.cellId
      payload[offset + 5] = row.chargeState | row.errorType
      writeUInt16LE(payload, offset + 6, row.value)
    })

    return payload
  }
}
