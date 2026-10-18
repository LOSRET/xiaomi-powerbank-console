// Generated from the decoder tables published by powerbank.mieco.net.
// The values are factual identifier mappings used for interoperability.

export const MANUFACTURERS_ZH: Record<string, string> = {
  ATLN: '宁德新能源科技有限公司',
  ATLD: '东莞新能源科技有限公司',
  BAKB: '郑州比克电池有限公司',
  BYDL: '上海比亚迪有限公司',
  LSDC: '天津力神电池股份有限公司',
  LSJY: '天津力神聚元新能源科技有限公司',
  LSSZ: '苏州力神新能源科技有限公司',
  SSTB: '三星（天津）电池有限公司',
  EVE1: '惠州亿纬锂能股份有限公司',
  LWN3: '浙江锂威能源科技有限公司',
  LWN2: '惠州锂威新能源科技有限公司',
  LWN1: '东莞锂威能源科技有限公司',
}

export const MANUFACTURERS_EN: Record<string, string> = {
  ATLN: 'Ningde Amperex Technology Limited',
  ATLD: 'Dongguan Amperex Technology Limited',
  BAKB: 'Zhengzhou BAK Battery Co.,Ltd',
  BYDL: 'SHANGHAI BYD COMPANY LIMITED',
  LSDC: 'Tianjin Lishen Battery Joint-Stock Co., Ltd.',
  LSJY: 'Tianjin Lishen Juyuan New Energy Technology Co.,Ltd.',
  LSSZ: 'Lishen Battery(SuZhou) Co., Ltd.',
  SSTB: 'Samsung SDI(Tianjin)Battery Co.,Ltd.',
  EVE1: 'EVE Energy Co., Ltd.',
  LWN3: 'Zhejiang Liwinon Energy Technology Co., Ltd.',
  LWN2: 'Huizhou Liwinon New Energy Technology Co., Ltd.',
  LWN1: 'Dongguan Liwinon Energy Technology Co., Ltd.',
}

export const PRODUCT_TYPES_ZH: Record<string, string> = {
  C: '单体电池',
  E: '小动力型电池模块',
  A: '消费型电池模块',
  F: '小动力型电池包',
  B: '消费型电池包',
  G: '小动力型电池系统',
  D: '消费型电池系统',
  H: '储能型电池模块',
  M: '大动力型电池模块',
  J: '储能型电池簇',
  P: '大动力型电池包',
  K: '储能型电池系统',
  S: '大动力型电池系统',
}

export const PRODUCT_TYPES_EN: Record<string, string> = {
  C: 'Single cell',
  E: 'Light-power battery module',
  A: 'Consumer battery module',
  F: 'Light-power battery pack',
  B: 'Consumer battery pack',
  G: 'Light-power battery system',
  D: 'Consumer battery system',
  H: 'Energy-storage battery module',
  M: 'High-power battery module',
  J: 'Energy-storage battery cluster',
  P: 'High-power battery pack',
  K: 'Energy-storage battery system',
  S: 'High-power battery system',
}

export const CHEMISTRY_ZH: Record<string, string> = {
  A: '磷酸锰铁锂电池',
  B: '磷酸亚铁锂电池',
  C: '锰酸锂电池',
  D: '钴酸锂电池',
  E: '镍钴锰三元电池',
  F: '镍钴铝三元电池',
  G: '钛酸锂电池',
  Z: '其他类电池',
}

export const CHEMISTRY_EN: Record<string, string> = {
  A: 'Lithium iron phosphate (LFP)',
  B: 'Lithium iron phosphate (LFP)',
  C: 'Lithium cobalt oxide (LCO)',
  D: 'Lithium manganese oxide (LMO)',
  E: 'Nickel cobalt manganese (NCM)',
  F: 'Nickel cobalt aluminum (NCA)',
  G: 'Lithium titanate (LTO)',
  Z: 'Other',
}

export const YEAR_CODES: Record<string, number> = {
  F: 2025,
  G: 2026,
  H: 2027,
  J: 2028,
  K: 2029,
  L: 2030,
  M: 2031,
  N: 2032,
  P: 2033,
  R: 2034,
  S: 2035,
  T: 2036,
  V: 2037,
}

export const MONTH_CODES: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  A: 10,
  B: 11,
  C: 12,
}

export const DAY_CODES: Record<string, number> = {
  '0': 31,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  P: 23,
  R: 24,
  S: 25,
  T: 26,
  V: 27,
  W: 28,
  X: 29,
  Y: 30,
}

export interface MiCodeInfo {
  project: string
  supplier: string
  cellModel: string
}

export const MI_CODE_INFO: Record<string, MiCodeInfo> = {
  ATLNADA: {
    project: 'P15',
    supplier: 'ATL',
    cellModel: '995662B',
  },
  ATLDADA: {
    project: 'P15',
    supplier: 'ATL',
    cellModel: '995662B',
  },
  ATLNHDA: {
    project: 'P15',
    supplier: 'ATL',
    cellModel: '995662B',
  },
  ATLDHDA: {
    project: 'P15',
    supplier: 'ATL',
    cellModel: '995662B',
  },
  ATLNDAA: {
    project: 'P15',
    supplier: 'ATL',
    cellModel: '995662B',
  },
  ATLDDAA: {
    project: 'P15',
    supplier: 'ATL',
    cellModel: '995662B',
  },
  ATLNE7A: {
    project: 'PB1067MI',
    supplier: 'ATL',
    cellModel: '605463',
  },
  ATLDE7A: {
    project: 'PB1067MI',
    supplier: 'ATL',
    cellModel: '605463',
  },
  ATLNHE7: {
    project: 'PB1067MI',
    supplier: 'ATL',
    cellModel: '605463',
  },
  ATLDHE7: {
    project: 'PB1067MI',
    supplier: 'ATL',
    cellModel: '605463',
  },
  ATLND9A: {
    project: 'WPB0525S/WPB1025S',
    supplier: 'ATL',
    cellModel: '436678B',
  },
  ATLDD9A: {
    project: 'WPB0525S/WPB1025S',
    supplier: 'ATL',
    cellModel: '436678B',
  },
  ATLNHD9: {
    project: 'WPB0525S/WPB1025S',
    supplier: 'ATL',
    cellModel: '436678B',
  },
  ATLDHD9: {
    project: 'WPB0525S/WPB1025S',
    supplier: 'ATL',
    cellModel: '436678B',
  },
  ATLNWSA: {
    project: 'WPB1007ZX',
    supplier: 'ATL',
    cellModel: '606072G',
  },
  ATLDWSA: {
    project: 'WPB1007ZX',
    supplier: 'ATL',
    cellModel: '606072G',
  },
  ATLNGWS: {
    project: 'WPB1007ZX',
    supplier: 'ATL',
    cellModel: '606072G',
  },
  ATLDGWS: {
    project: 'WPB1007ZX',
    supplier: 'ATL',
    cellModel: '606072G',
  },
  ATLNDLA: {
    project: 'WPB1025',
    supplier: 'ATL',
    cellModel: '636078',
  },
  ATLDDLA: {
    project: 'WPB1025',
    supplier: 'ATL',
    cellModel: '636078',
  },
  ATLNHDL: {
    project: 'WPB1025',
    supplier: 'ATL',
    cellModel: '636078',
  },
  ATLDHDL: {
    project: 'WPB1025',
    supplier: 'ATL',
    cellModel: '636078',
  },
  ATLNHJQ: {
    project: 'WPB0525S/WPB1026S',
    supplier: 'ATL',
    cellModel: '436678N',
  },
  ATLDHJQ: {
    project: 'WPB0525S/WPB1026S',
    supplier: 'ATL',
    cellModel: '436678N',
  },
  ATLNHJP: {
    project: 'P17',
    supplier: 'ATL',
    cellModel: '995662N',
  },
  ATLDHJP: {
    project: 'P17',
    supplier: 'ATL',
    cellModel: '995662N',
  },
  ATLNHEC: {
    project: 'P25',
    supplier: 'ATL',
    cellModel: '584592',
  },
  ATLDHEC: {
    project: 'P25',
    supplier: 'ATL',
    cellModel: '584592',
  },
  ATLN534: {
    project: 'P25',
    supplier: 'ATL',
    cellModel: '584592',
  },
  ATLD534: {
    project: 'P25',
    supplier: 'ATL',
    cellModel: '584592',
  },
  ATLN586: {
    project: 'P25',
    supplier: 'ATL',
    cellModel: '584592',
  },
  ATLD586: {
    project: 'P25',
    supplier: 'ATL',
    cellModel: '584592',
  },
  LSJYT04: {
    project: 'P15/P17',
    supplier: '力神',
    cellModel: 'SP995662SF',
  },
  LSDCT04: {
    project: 'P15/P17',
    supplier: '力神',
    cellModel: 'SP995662SF',
  },
  LSSZT04: {
    project: 'P15/P17',
    supplier: '力神',
    cellModel: 'SP995662SF',
  },
  LSJYT12: {
    project: 'PB1067MI',
    supplier: '力神',
    cellModel: 'SP605463SC',
  },
  LSDCT12: {
    project: 'PB1067MI',
    supplier: '力神',
    cellModel: 'SP605463SC',
  },
  LSSZT12: {
    project: 'PB1067MI',
    supplier: '力神',
    cellModel: 'SP605463SC',
  },
  LSJYT07: {
    project: 'PB2020/PB2045MI/PB2021',
    supplier: '力神',
    cellModel: 'SP126280SX',
  },
  LSDCT07: {
    project: 'PB2020/PB2045MI/PB2021',
    supplier: '力神',
    cellModel: 'SP126280SX',
  },
  LSSZT07: {
    project: 'PB2020/PB2045MI/PB2021',
    supplier: '力神',
    cellModel: 'SP126280SX',
  },
  LSJYT03: {
    project: 'PB2067MI',
    supplier: '力神',
    cellModel: 'SP786288SF',
  },
  LSDCT03: {
    project: 'PB2067MI',
    supplier: '力神',
    cellModel: 'SP786288SF',
  },
  LSSZT03: {
    project: 'PB2067MI',
    supplier: '力神',
    cellModel: 'SP786288SF',
  },
  LSJYT01: {
    project: 'WPB1025',
    supplier: '力神',
    cellModel: 'SP626078SF',
  },
  LSDCT01: {
    project: 'WPB1025',
    supplier: '力神',
    cellModel: 'SP626078SF',
  },
  LSSZT01: {
    project: 'WPB1025',
    supplier: '力神',
    cellModel: 'SP626078SF',
  },
  LSJYT21: {
    project: 'WPB1025S/WPB1026S',
    supplier: '力神',
    cellModel: 'SP436678SQ',
  },
  LSDCT21: {
    project: 'WPB1025S/WPB1026S',
    supplier: '力神',
    cellModel: 'SP436678SQ',
  },
  LSSZT21: {
    project: 'WPB1025S/WPB1026S',
    supplier: '力神',
    cellModel: 'SP436678SQ',
  },
  LSJYT22: {
    project: 'WPB0525S',
    supplier: '力神',
    cellModel: 'SP446578SQ',
  },
  LSDCT22: {
    project: 'WPB0525S',
    supplier: '力神',
    cellModel: 'SP446578SQ',
  },
  LSSZT22: {
    project: 'WPB0525S',
    supplier: '力神',
    cellModel: 'SP446578SQ',
  },
  LSJYT11: {
    project: 'AC1067/NPB1055R',
    supplier: '力神',
    cellModel: 'SP753968SI',
  },
  LSDCT11: {
    project: 'AC1067/NPB1055R',
    supplier: '力神',
    cellModel: 'SP753968SI',
  },
  LSSZT11: {
    project: 'AC1067/NPB1055R',
    supplier: '力神',
    cellModel: 'SP753968SI',
  },
  LWN2AC9: {
    project: 'P25',
    supplier: '锂威',
    cellModel: '584592',
  },
  LWN1AC9: {
    project: 'P25',
    supplier: '锂威',
    cellModel: '584592',
  },
  LWN3AC9: {
    project: 'P25',
    supplier: '锂威',
    cellModel: '584592',
  },
  LWN2MFH: {
    project: 'P25',
    supplier: '锂威',
    cellModel: '584592',
  },
  LWN1MFH: {
    project: 'P25',
    supplier: '锂威',
    cellModel: '584592',
  },
  LWN3MFH: {
    project: 'P25',
    supplier: '锂威',
    cellModel: '584592',
  },
  LWN2MAI: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN2MAG: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN1MAI: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN3MAI: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN2AC8: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN1AC8: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN3AC8: {
    project: 'AC1067/NPB1055R',
    supplier: '锂威',
    cellModel: '753968',
  },
  LWN2MIF: {
    project: 'PB2020/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280B',
  },
  LWN1MIF: {
    project: 'PB2020/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280B',
  },
  LWN3MIF: {
    project: 'PB2020/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280B',
  },
  LWN2AA9: {
    project: 'PB2020/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280B',
  },
  LWN1AA9: {
    project: 'PB2020/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280B',
  },
  LWN3AA9: {
    project: 'PB2020/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280B',
  },
  LWN2MLE: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN1MLE: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN3MLE: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN2AB1: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN1AB1: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN3AB1: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN2LVD: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN1LVD: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN3LVD: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN2LVE: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN1LVE: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN3LVE: {
    project: 'PB2067MI',
    supplier: '锂威',
    cellModel: '786288',
  },
  LWN2AF7: {
    project: 'PB2021/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280BA',
  },
  LWN1AF7: {
    project: 'PB2021/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280BA',
  },
  LWN3AF7: {
    project: 'PB2021/PB2045MI',
    supplier: '锂威',
    cellModel: 'C16280BA',
  },
}
