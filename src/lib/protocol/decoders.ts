import type {
  BatteryIdInfo,
  BatteryInfo,
  CellStatus,
  HelloInfo,
  HistoryRecord,
  TempModelInfo,
} from '@/types/device'
import { findModelById } from '@/data/models'
import { parseBatteryId } from './battery-id'

function readUInt16LE(data: Uint8Array, offset: number): number {
  return (data[offset] ?? 0) | ((data[offset + 1] ?? 0) << 8)
}

function readInt16LE(data: Uint8Array, offset: number): number {
  const value = readUInt16LE(data, offset)
  return value > 0x7fff ? value - 0x10000 : value
}

function readUInt32LE(data: Uint8Array, offset: number): number {
  return (
    ((data[offset] ?? 0) |
      ((data[offset + 1] ?? 0) << 8) |
      ((data[offset + 2] ?? 0) << 16) |
      ((data[offset + 3] ?? 0) << 24)) >>>
    0
  )
}

function toSignedByte(value: number): number {
  return value > 0x7f ? value - 0x100 : value
}

function ascii(data: Uint8Array, start = 0, end = data.length): string {
  const slice = data.subarray(start, end)
  const terminator = slice.indexOf(0)
  const bytes = terminator >= 0 ? slice.subarray(0, terminator) : slice
  return Array.from(bytes)
    .filter((value) => value >= 0x20 && value <= 0x7e)
    .map((value) => String.fromCharCode(value))
    .join('')
    .trim()
}

export function decodeHello(payload: Uint8Array): HelloInfo {
  if (payload.length < 23) throw new Error('Hello response is shorter than 23 bytes')
  const modelId = readUInt16LE(payload, 0)
  return {
    modelId,
    model: findModelById(modelId),
    serialNumber: ascii(payload, 2, 22),
    chargingStatusCode: payload[22] ?? 0,
    rawPayload: payload,
  }
}

export function decodeBatteryInfo(payload: Uint8Array): BatteryInfo {
  if (payload.length < 18) {
    throw new Error(`Battery response is shorter than 18 bytes (${payload.length})`)
  }

  const stateByte = payload[6] ?? 0
  const series = ((payload[11] ?? 0) >> 4) & 0x0f
  const parallel = (payload[11] ?? 0) & 0x0f
  const config = payload[11] ?? 0
  const cellCount =
    (series === 0 && config !== 0 ? 1 : series) * (parallel === 0 && config !== 0 ? 1 : parallel)

  return {
    statusCode: payload[0] ?? 0,
    activated: payload[1] === 1,
    cycleCount: readUInt16LE(payload, 2),
    health: readUInt16LE(payload, 4),
    chargeState: (stateByte >> 6) & 0x03,
    faultType: stateByte & 0x3f,
    errorValue: readUInt16LE(payload, 7),
    historyErrorCount: readUInt16LE(payload, 9),
    series,
    parallel,
    cellCount,
    level: payload[12] ?? 0,
    temperature: toSignedByte(payload[13] ?? 0),
    voltage: readUInt16LE(payload, 14),
    current: readInt16LE(payload, 16),
    rawPayload: payload,
  }
}

export function decodeCellStatus(payload: Uint8Array): CellStatus[] {
  if (payload.length < 1) throw new Error('Cell status response is empty')
  if (payload[0] !== 0) throw new Error(`Cell status request failed (${payload[0]})`)

  const cellSize = 5
  const count = Math.floor((payload.length - 1) / cellSize)
  const cells: CellStatus[] = []

  for (let index = 0; index < count; index += 1) {
    const offset = 1 + index * cellSize
    const temperature = toSignedByte(payload[offset] ?? 0)
    cells.push({
      index: index + 1,
      temperature,
      voltage: readUInt16LE(payload, offset + 1),
      current: readInt16LE(payload, offset + 3),
      hasTemperatureSensor: temperature !== -127,
    })
  }

  return cells
}

export function decodeBatteryId(payload: Uint8Array): BatteryIdInfo {
  if (payload.length < 2) throw new Error('Battery id response is too short')
  const raw = ascii(payload, 2, Math.min(payload.length, 31))
  return {
    statusCode: payload[0] ?? 0,
    index: payload[1] ?? 0,
    raw,
    parsed: parseBatteryId(raw),
  }
}

export function decodeTempModel(payload: Uint8Array): TempModelInfo {
  if (payload.length < 5) throw new Error('Temperature model response is too short')
  const statusCode = payload[0] ?? 0
  const success = statusCode === 0
  const highTemp = success ? readInt16LE(payload, 1) : null
  const lowTemp = success ? readInt16LE(payload, 3) : null
  const batteryModel = success ? ascii(payload, 5) : ''

  return {
    statusCode,
    success,
    highTemp,
    lowTemp,
    range: highTemp !== null && lowTemp !== null ? `${lowTemp}℃~${highTemp}℃` : '--',
    batteryModel,
  }
}

export interface HistoryBatch {
  statusCode: number
  records: HistoryRecord[]
}

export function decodeHistoryBatch(payload: Uint8Array): HistoryBatch {
  if (payload.length < 1) throw new Error('History response is empty')
  const statusCode = payload[0] ?? 0
  const records: HistoryRecord[] = []
  const recordSize = 8

  if (statusCode === 0) {
    const available = Math.floor((payload.length - 1) / recordSize)
    const count = Math.min(7, available)

    for (let index = 0; index < count; index += 1) {
      const offset = 1 + index * recordSize
      const stateByte = payload[offset + 5] ?? 0
      const errorType = stateByte & 0x3f
      const rawValue = readUInt16LE(payload, offset + 6)
      const value = errorType === 3 || errorType === 4 ? toSignedWord(rawValue) : rawValue

      records.push({
        timestamp: readUInt32LE(payload, offset),
        cellId: payload[offset + 4] ?? 0,
        chargeState: stateByte & 0xc0,
        errorType,
        value,
        statusDescription: '',
        rawHex: Array.from(payload.subarray(offset, offset + recordSize))
          .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
          .join(''),
      })
    }
  }

  return { statusCode, records }
}

function toSignedWord(value: number): number {
  return value > 0x7fff ? value - 0x10000 : value
}

export function chargeStateKey(code: number): string {
  switch (code) {
    case 0:
      return 'status.discharging'
    case 1:
      return 'status.charging'
    case 2:
      return 'status.idle'
    default:
      return 'status.unknown'
  }
}

/** The Hello response uses a separate three-value state enum. */
export function helloStateKey(code: number): string {
  switch (code) {
    case 0:
      return 'status.idle'
    case 1:
      return 'status.charging'
    case 2:
      return 'status.discharging'
    default:
      return 'status.unknown'
  }
}

export function faultKey(code: number): string {
  switch (code) {
    case 0:
      return 'fault.normal'
    case 1:
      return 'fault.overvoltage'
    case 2:
      return 'fault.undervoltage'
    case 3:
      return 'fault.dischargeHighTemperature'
    case 4:
      return 'fault.dischargeLowTemperature'
    case 5:
      return 'fault.chargeHighTemperature'
    case 6:
      return 'fault.chargeLowTemperature'
    case 7:
      return 'fault.shortCircuit'
    case 8:
      return 'fault.mos'
    case 9:
      return 'fault.afe'
    default:
      return 'fault.unknown'
  }
}

export function historyFaultKey(errorType: number, chargeState: number): string {
  switch (errorType) {
    case 0:
      return 'fault.normal'
    case 1:
      return 'fault.cellOvervoltage'
    case 2:
      return 'fault.cellUndervoltage'
    case 3:
      return chargeState === 0x80
        ? 'fault.idleHighTemperature'
        : chargeState === 0x40
          ? 'fault.chargeHighTemperature'
          : 'fault.dischargeHighTemperature'
    case 4:
      return chargeState === 0x40 ? 'fault.chargeLowTemperature' : 'fault.dischargeLowTemperature'
    case 5:
      return 'fault.overCurrent'
    case 6:
      return 'fault.shortCircuit'
    case 7:
      return 'fault.cellVoltageDifference'
    case 8:
      return 'fault.mos'
    case 9:
      return 'fault.afe'
    default:
      return 'fault.unknown'
  }
}
