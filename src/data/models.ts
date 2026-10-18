import type { Lang, PowerBankModel } from '@/types/device'

/**
 * Supported models exposed by the original detail page. `isShow` controls the
 * public model list; hidden entries are still used to identify a connected
 * device by its Hello response.
 */
const POWER_BANK_MODELS: PowerBankModel[] = [
  {
    id: 9,
    name: '小米金沙江充电宝 超薄磁吸 10000 45W',
    nameEn: 'Xiaomi UltraThin Magnetic Power Bank 10000 25W',
    model: 'WPB1025S',
    connection: 'C1',
    isShow: true,
    tempRange: '-20℃~60℃',
    supportsQI2: false,
    supportsQi2Toggle: true,
  },
  {
    id: 16,
    name: '小米金沙江充电宝 超薄磁吸 10000 45W',
    nameEn: 'Xiaomi UltraThin Magnetic Power Bank 10000 25W',
    model: 'WPB1026S',
    connection: 'C1',
    isShow: true,
    tempRange: '-20℃~60℃',
    // WPB1026S is read-only here; the Qi2.2 toggle is only enabled for WPB1025S.
  },
  {
    id: 10,
    name: '小米金沙江充电宝 超薄磁吸 5000 27W',
    nameEn: 'Xiaomi UltraThin Magnetic Power Bank 5000 25W',
    model: 'WPB0525S',
    connection: 'C1',
    isShow: true,
    tempRange: '-20℃~60℃',
    supportsQI2: false,
  },
  {
    id: 11,
    name: '小米充电宝 磁吸支架 10000 7.5W 2026版',
    nameEn: 'Xiaomi Magnetic Power Bank 10000 with Built-in Stand 2026',
    model: 'WPB1007ZX',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 12,
    name: '小米充电宝 磁吸自带线 10000 45W',
    nameEn: 'Xiaomi Magnetic Power Bank 10000 25W (Integrated Cable) 2027',
    model: 'WPB1025',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
    supportsQI2: true,
  },
  {
    id: 3,
    name: '小米充电宝 自带线 20000 45W',
    nameEn: 'Xiaomi Power Bank 20000 45W Boost (Integrated Cable)',
    model: 'PB2045MI',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 5,
    name: '小米充电宝 自带线 20000 67W',
    nameEn: 'Xiaomi 67W Power Bank 20000 (Integrated Cable)',
    model: 'PB2067MI',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 19,
    name: '小米金沙江充电宝 超薄磁吸 10000 45W',
    nameEn: 'Xiaomi UltraThin Magnetic Power Bank 10000 25W',
    model: 'WPB1025S',
    connection: 'C1',
    isShow: false,
    tempRange: '-20℃~60℃',
    supportsQi2Toggle: true,
  },
  {
    id: 18,
    name: '小米充电宝 自带线 20000 22.5W',
    nameEn: 'Xiaomi Power Bank 20000 (Integrated Cable) 2027',
    model: 'PB2021',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 14,
    name: '小米自带线充电宝 20000 22.5W 2026',
    nameEn: 'Xiaomi Power Bank 20000 (Integrated Cable)',
    model: 'PB2020',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 13,
    name: '小米自带线充电宝 10000 口袋版 2026',
    nameEn: 'Xiaomi Power Bank 10000 (Integrated Cable)',
    model: 'P15',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 17,
    name: '小米自带线充电宝 10000 口袋版',
    nameEn: 'Xiaomi Power Bank 10000 (Integrated Cable) 2027',
    model: 'P17',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 1,
    name: '小米自带线充电宝 10000 67W',
    nameEn: 'Xiaomi 67W Power Bank 10000 (Integrated Cable)',
    model: 'PB1067MI',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 7,
    name: '小米充电宝 伸缩线 10000 55W',
    nameEn: 'Xiaomi Power Bank 10000 55W (Retractable Cable)',
    model: 'NPB1055R',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~60℃',
  },
  {
    id: 6,
    name: '小米充电宝 Pro 25000 250W',
    nameEn: 'Xiaomi Power Bank Pro 25000 250W',
    model: 'P25',
    connection: 'C2',
    isShow: true,
    tempRange: '-20℃~70℃',
  },
]

export const VISIBLE_MODELS = POWER_BANK_MODELS.filter((model) => model.isShow)

export function findModelById(id: number): PowerBankModel | null {
  return POWER_BANK_MODELS.find((model) => model.id === id) ?? null
}

export function modelDisplayName(model: PowerBankModel, lang: Lang): string {
  return lang === 'en' ? model.nameEn : model.name
}
