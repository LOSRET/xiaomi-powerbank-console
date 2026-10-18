import type { Lang } from '@/types/device'

export function formatVoltage(millivolts: number, digits = 2): string {
  return `${(millivolts / 1000).toFixed(digits)} V`
}

export function formatCurrent(milliamps: number): string {
  return `${(milliamps / 1000).toFixed(2)} A`
}

export function formatTemperature(celsius: number): string {
  return `${celsius} °C`
}

export function formatLevel(level: number): string {
  return `${Math.max(0, Math.min(100, level))}%`
}

export function formatPercent(value: number): string {
  return `${value}%`
}

export function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

/**
 * The device stores Beijing wall-clock time in the low 32 bits. The original
 * implementation displays the raw value with a fixed UTC+8 offset, so format
 * it as UTC to keep the same wall-clock reading in every browser timezone.
 */
export function formatDeviceTime(seconds: number, lang: Lang): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--'
  const date = new Date(seconds * 1000)
  if (Number.isNaN(date.getTime())) return '--'

  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'zh-CN', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatClock(timestamp: number, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

export function formatRelativeTime(timestamp: number, lang: Lang): string {
  const delta = Math.round((Date.now() - timestamp) / 1000)
  if (delta < 5) return lang === 'en' ? 'just now' : '刚刚'
  if (delta < 60) return lang === 'en' ? `${delta}s ago` : `${delta} 秒前`
  if (delta < 3600) {
    const minutes = Math.floor(delta / 60)
    return lang === 'en' ? `${minutes}m ago` : `${minutes} 分钟前`
  }
  return formatClock(timestamp, lang)
}

export function formatHexInteger(value: number): string {
  return `0x${value.toString(16).toUpperCase()}`
}
