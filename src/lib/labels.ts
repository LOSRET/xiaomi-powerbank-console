import type { MessageKey } from '@/data/i18n'
import type { HistoryRecord } from '@/types/device'
import { formatCurrent, formatTemperature, formatVoltage } from '@/lib/formatting'

// The protocol layer decodes device codes as plain numbers; this module is
// where those codes become user-facing vocabulary and unit labels. Keeping the
// mapping here leaves wire decoding free of i18n concerns, and the MessageKey
// return type makes typecheck verify every key against the dictionaries.

export function chargeStateKey(code: number): MessageKey {
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

export type ChargeVisualStatus = 'charging' | 'discharging' | 'idle' | 'unknown'

export function chargeStateVisual(code: number | undefined): ChargeVisualStatus {
  switch (code) {
    case 0:
      return 'discharging'
    case 1:
      return 'charging'
    case 2:
      return 'idle'
    default:
      return 'unknown'
  }
}

export function faultKey(code: number): MessageKey {
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

export function historyFaultKey(errorType: number, chargeState: number): MessageKey {
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

export function historyValueLabel(record: HistoryRecord): string {
  if (record.errorType === 1 || record.errorType === 2) {
    return formatVoltage(record.value)
  }
  if (record.errorType === 3 || record.errorType === 4) {
    return formatTemperature(record.value)
  }
  if (record.errorType === 5) {
    return record.value > 100 ? formatCurrent(record.value) : `${record.value} A`
  }
  if (record.errorType === 7) {
    return `${record.value} mV`
  }
  return String(record.value)
}
