import {
  CHEMISTRY_EN,
  CHEMISTRY_ZH,
  DAY_CODES,
  MANUFACTURERS_EN,
  MANUFACTURERS_ZH,
  MI_CODE_INFO,
  MONTH_CODES,
  PRODUCT_TYPES_EN,
  PRODUCT_TYPES_ZH,
  YEAR_CODES,
} from '@/data/batteryIdMaps'
import type { BatteryIdParsed } from '@/types/device'

const EMPTY_MI_CODE = { project: '--', supplier: '--', cellModel: '--' }

/**
 * Decode the identifier printed on an individual cell. The first nine
 * characters are fixed; the remaining characters contain the separator,
 * checksum, Xiaomi project code and free-form data.
 */
export function parseBatteryId(input: string): BatteryIdParsed | null {
  if (!input || typeof input !== 'string') return null

  const raw = input.trim()
  const compact = raw.replace(/\s+/g, '')
  if (compact.length < 9) return null

  const fixedRaw = compact.slice(0, 9)
  const enterpriseCode = fixedRaw.slice(0, 4)
  const productTypeCode = fixedRaw[4] ?? ''
  const batteryTypeCode = fixedRaw[5] ?? ''
  const yearCode = fixedRaw[6] ?? ''
  const monthCode = fixedRaw[7] ?? ''
  const dayCode = fixedRaw[8] ?? ''

  const year = YEAR_CODES[yearCode]
  const month = MONTH_CODES[monthCode]
  const day = DAY_CODES[dayCode]
  const productionDate = year && month && day ? `${year}-${pad(month)}-${pad(day)}` : '--'

  let rest = compact.slice(9)
  let ladderCode = ''

  if (rest.startsWith('-R-')) {
    ladderCode = '-R'
    rest = rest.slice(3)
  } else if (rest.startsWith('R-')) {
    ladderCode = '-R'
    rest = rest.slice(2)
  }

  let separator = ''
  let checksum = ''
  let miCode = ''
  let variable = rest

  if (rest.length >= 5) {
    separator = rest[0] ?? ''
    checksum = rest[1] ?? ''
    miCode = rest.slice(2, 5)
    variable = rest.slice(5)
  }

  const compositeKey = `${enterpriseCode}${miCode}`

  return {
    raw,
    fixed: {
      enterpriseCode,
      assemblyFactory: MANUFACTURERS_ZH[enterpriseCode] ?? '--',
      assemblyFactoryEn: MANUFACTURERS_EN[enterpriseCode] ?? '--',
      productTypeCode,
      productType: PRODUCT_TYPES_ZH[productTypeCode] ?? '--',
      productTypeEn: PRODUCT_TYPES_EN[productTypeCode] ?? '--',
      batteryTypeCode,
      batteryType: CHEMISTRY_ZH[batteryTypeCode] ?? '--',
      batteryTypeEn: CHEMISTRY_EN[batteryTypeCode] ?? '--',
      dateCode: `${yearCode}${monthCode}${dayCode}`,
      productionDate,
    },
    ladderCode,
    separator,
    checksum,
    compositeKey,
    miCode,
    miCodeInfo: MI_CODE_INFO[compositeKey] ?? { ...EMPTY_MI_CODE },
    variable,
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
