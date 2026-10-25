import { describe, expect, it } from 'vitest'
import { MESSAGES, type MessageKey } from '@/data/i18n'
import { DEFAULT_TEMP_RANGE } from '@/data/models'
import {
  chargeStateKey,
  chargeStateVisual,
  faultKey,
  historyFaultKey,
  historyValueLabel,
} from '@/lib/labels'
import { formatTempRange } from '@/lib/formatting'
import type { HistoryRecord } from '@/types/device'

function record(errorType: number, value: number, chargeState = 0): HistoryRecord {
  return { timestamp: 0, cellId: 1, chargeState, errorType, value }
}

describe('device code label keys', () => {
  it('maps every known code to a key present in both dictionaries', () => {
    const keys = [
      ...[0, 1, 2, 3, 99].map(chargeStateKey),
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99].map(faultKey),
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99].flatMap((errorType) =>
        [0, 0x40, 0x80].map((chargeState) => historyFaultKey(errorType, chargeState)),
      ),
    ]

    for (const key of keys) {
      for (const dictionary of Object.values(MESSAGES)) {
        expect(dictionary[key as MessageKey], `missing key "${key}"`).toBeTruthy()
      }
    }
  })

  it('maps charge states and faults', () => {
    expect(chargeStateKey(1)).toBe('status.charging')
    expect(chargeStateKey(2)).toBe('status.idle')
    expect(chargeStateKey(99)).toBe('status.unknown')
    expect(faultKey(0)).toBe('fault.normal')
    expect(faultKey(99)).toBe('fault.unknown')
  })

  it('maps the history fault context from the charge state', () => {
    expect(historyFaultKey(3, 0x40)).toBe('fault.chargeHighTemperature')
    expect(historyFaultKey(3, 0x80)).toBe('fault.idleHighTemperature')
    expect(historyFaultKey(3, 0x00)).toBe('fault.dischargeHighTemperature')
    expect(historyFaultKey(4, 0x40)).toBe('fault.chargeLowTemperature')
    expect(historyFaultKey(1, 0x40)).toBe('fault.cellOvervoltage')
  })
})

describe('charge visual status', () => {
  it('mirrors the charge state codes', () => {
    expect(chargeStateVisual(0)).toBe('discharging')
    expect(chargeStateVisual(1)).toBe('charging')
    expect(chargeStateVisual(2)).toBe('idle')
    expect(chargeStateVisual(3)).toBe('unknown')
    expect(chargeStateVisual(undefined)).toBe('unknown')
  })
})

describe('history value labels', () => {
  it('formats values with the unit of their error type', () => {
    expect(historyValueLabel(record(1, 4380))).toBe('4.38 V')
    expect(historyValueLabel(record(2, 3200))).toBe('3.20 V')
    expect(historyValueLabel(record(3, 46))).toBe('46 °C')
    expect(historyValueLabel(record(4, -5))).toBe('-5 °C')
    expect(historyValueLabel(record(5, 150))).toBe('0.15 A')
    expect(historyValueLabel(record(5, 5))).toBe('5 A')
    expect(historyValueLabel(record(7, 12))).toBe('12 mV')
    expect(historyValueLabel(record(0, 42))).toBe('42')
    expect(historyValueLabel(record(99, 7))).toBe('7')
  })
})

describe('temperature range formatting', () => {
  it('formats thresholds as a range matching the model-table default', () => {
    expect(formatTempRange(-20, 60)).toBe(DEFAULT_TEMP_RANGE)
    expect(formatTempRange(-20, 70)).toBe('-20℃~70℃')
  })
})
