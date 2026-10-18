import { describe, expect, it } from 'vitest'
import {
  chargeStateKey,
  decodeBatteryId,
  decodeBatteryInfo,
  decodeCellStatus,
  decodeHello,
  decodeHistoryBatch,
  decodeQi2Enable,
  decodeQi2Status,
  decodeTempModel,
  historyFaultKey,
} from '@/lib/protocol/decoders'
import { parseBatteryId } from '@/lib/protocol/battery-id'
import { findModelById } from '@/data/models'

function u16(value: number): number[] {
  return [value & 0xff, (value >>> 8) & 0xff]
}

function ascii(value: string, length = value.length): number[] {
  return Array.from({ length }, (_, index) => value.charCodeAt(index) || 0)
}

describe('hello decoder', () => {
  it('reads model id, serial and state', () => {
    const payload = new Uint8Array(23)
    payload.set(u16(9), 0)
    payload.set(ascii('DMPB1025S0001', 20), 2)
    payload[22] = 1

    const hello = decodeHello(payload)
    expect(hello.modelId).toBe(9)
    expect(hello.model?.model).toBe('WPB1025S')
    expect(hello.model?.supportsQi2Toggle).toBe(true)
    expect(hello.serialNumber).toBe('DMPB1025S0001')
    expect(hello.chargingStatusCode).toBe(1)
  })
})

describe('battery info decoder', () => {
  it('decodes the 18-byte battery payload', () => {
    const payload = new Uint8Array(18)
    payload[0] = 0
    payload[1] = 1
    payload.set(u16(37), 2)
    payload.set(u16(97), 4)
    payload[6] = 0x40
    payload.set(u16(0), 7)
    payload.set(u16(3), 9)
    payload[11] = 0x12
    payload[12] = 86
    payload[13] = 29
    payload.set(u16(7700), 14)
    payload.set(u16(1180), 16)

    const info = decodeBatteryInfo(payload)
    expect(info.activated).toBe(true)
    expect(info.cycleCount).toBe(37)
    expect(info.health).toBe(97)
    expect(info.chargeState).toBe(1)
    expect(info.faultType).toBe(0)
    expect(info.historyErrorCount).toBe(3)
    expect(info.series).toBe(1)
    expect(info.parallel).toBe(2)
    expect(info.cellCount).toBe(2)
    expect(info.level).toBe(86)
    expect(info.temperature).toBe(29)
    expect(info.voltage).toBe(7700)
    expect(info.current).toBe(1180)
    expect(chargeStateKey(info.chargeState)).toBe('status.charging')
  })

  it('reads signed temperatures and currents', () => {
    const payload = new Uint8Array(18)
    payload[11] = 0x11
    payload[13] = 0xfe // -2 °C
    payload.set(u16(7500), 14)
    payload.set(u16(0xfff6), 16) // -10 mA

    const info = decodeBatteryInfo(payload)
    expect(info.temperature).toBe(-2)
    expect(info.current).toBe(-10)
    expect(info.cellCount).toBe(1)
  })
})

describe('cell status decoder', () => {
  it('decodes five bytes per cell and skips invalid temp sensors', () => {
    const payload = new Uint8Array(11)
    payload[0] = 0
    payload.set([29, ...u16(3852), ...u16(602)], 1)
    payload.set([0x81, ...u16(3848), ...u16(0xfff6)], 6)

    const cells = decodeCellStatus(payload)
    expect(cells).toHaveLength(2)
    expect(cells[0]).toMatchObject({
      index: 1,
      temperature: 29,
      voltage: 3852,
      current: 602,
      hasTemperatureSensor: true,
    })
    expect(cells[1]).toMatchObject({
      index: 2,
      temperature: -127,
      voltage: 3848,
      current: -10,
      hasTemperatureSensor: false,
    })
  })
})

describe('battery id decoder', () => {
  it('parses a fixed code and the Xiaomi project table', () => {
    const raw = 'ATLNDAG3F-1D9A26A0123'
    const payload = new Uint8Array(2 + raw.length)
    payload[0] = 0
    payload[1] = 1
    payload.set(ascii(raw), 2)

    const info = decodeBatteryId(payload)
    expect(info.raw).toBe(raw)
    expect(info.parsed?.fixed.enterpriseCode).toBe('ATLN')
    expect(info.parsed?.fixed.productionDate).toBe('2026-03-15')
    expect(info.parsed?.compositeKey).toBe('ATLND9A')
    expect(info.parsed?.miCodeInfo.cellModel).toBe('436678B')
  })

  it('returns null for short identifiers', () => {
    expect(parseBatteryId('ATLN')).toBeNull()
    expect(parseBatteryId('')).toBeNull()
  })
})

describe('temperature model decoder', () => {
  it('reads thresholds and model', () => {
    const payload = new Uint8Array(5 + 7)
    payload[0] = 0
    payload.set(u16(60), 1)
    payload.set(u16(0xffec), 3) // -20
    payload.set(ascii('436678B'), 5)

    const model = decodeTempModel(payload)
    expect(model.success).toBe(true)
    expect(model.range).toBe('-20℃~60℃')
    expect(model.batteryModel).toBe('436678B')
  })
})

describe('Qi2.2 model gate', () => {
  it('only enables the control for WPB1025S', () => {
    expect(findModelById(9)?.supportsQi2Toggle).toBe(true)
    expect(findModelById(19)?.supportsQi2Toggle).toBe(true)
    expect(findModelById(16)?.supportsQi2Toggle).not.toBe(true)
    expect(findModelById(10)?.supportsQi2Toggle).not.toBe(true)
    expect(findModelById(12)?.supportsQi2Toggle).not.toBe(true)
  })
})

describe('Qi2.2 decoders', () => {
  it('reads the enabled flag and status code', () => {
    expect(decodeQi2Status(new Uint8Array([0, 1]))).toMatchObject({
      statusCode: 0,
      success: true,
      enabled: true,
    })
    expect(decodeQi2Status(new Uint8Array([0, 0])).enabled).toBe(false)
    expect(decodeQi2Status(new Uint8Array([1, 1]))).toMatchObject({
      statusCode: 1,
      success: false,
      enabled: true,
    })
  })

  it('decodes the set response and rejects empty payloads', () => {
    expect(decodeQi2Enable(new Uint8Array([0]))).toMatchObject({
      statusCode: 0,
      success: true,
    })
    expect(decodeQi2Enable(new Uint8Array([2])).success).toBe(false)
    expect(() => decodeQi2Status(new Uint8Array([0]))).toThrow('shorter than 2 bytes')
    expect(() => decodeQi2Enable(new Uint8Array())).toThrow('empty')
  })
})

describe('history decoder', () => {
  it('decodes records and maps the fault context', () => {
    const payload = new Uint8Array(1 + 8)
    payload[0] = 0
    const offset = 1
    const timestamp = Math.floor(Date.UTC(2026, 8, 12, 14, 32) / 1000)
    payload[offset] = timestamp & 0xff
    payload[offset + 1] = (timestamp >>> 8) & 0xff
    payload[offset + 2] = (timestamp >>> 16) & 0xff
    payload[offset + 3] = (timestamp >>> 24) & 0xff
    payload[offset + 4] = 1
    payload[offset + 5] = 0x40 | 3
    payload[offset + 6] = 46
    payload[offset + 7] = 0

    const batch = decodeHistoryBatch(payload)
    expect(batch.records).toHaveLength(1)
    expect(batch.records[0]).toMatchObject({
      timestamp,
      cellId: 1,
      chargeState: 0x40,
      errorType: 3,
      value: 46,
    })
    expect(historyFaultKey(3, 0x40)).toBe('fault.chargeHighTemperature')
    expect(historyFaultKey(3, 0x80)).toBe('fault.idleHighTemperature')
    expect(historyFaultKey(1, 0x40)).toBe('fault.cellOvervoltage')
  })
})
