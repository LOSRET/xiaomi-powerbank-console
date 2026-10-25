export type Lang = 'zh-CN' | 'en'

export interface PowerBankModel {
  id: number
  name: string
  nameEn: string
  model: string
  connection: 'C1' | 'C2'
  isShow: boolean
  tempRange: string
  /** Official/marketing Qi2 support from the model table. */
  supportsQI2?: boolean
  /** Community 0x06/0x07 toggle, only enabled for WPB1025S. */
  supportsQi2Toggle?: boolean
}

export interface DeviceIdentity {
  productName: string
  vendorId: number
  productId: number
  modelId: number
  model: string
  serialNumber: string
  displayName: string
  displayNameEn: string
}

export interface HelloInfo {
  modelId: number
  model: PowerBankModel | null
  serialNumber: string
  chargingStatusCode: number
  rawPayload: Uint8Array
}

export interface BatteryInfo {
  statusCode: number
  activated: boolean
  cycleCount: number
  health: number
  chargeState: number
  faultType: number
  errorValue: number
  historyErrorCount: number
  series: number
  parallel: number
  cellCount: number
  level: number
  temperature: number
  voltage: number
  current: number
  rawPayload: Uint8Array
}

export interface CellStatus {
  index: number
  temperature: number
  voltage: number
  current: number
  hasTemperatureSensor: boolean
}

export interface BatteryIdParsed {
  raw: string
  fixed: {
    enterpriseCode: string
    assemblyFactory: string
    assemblyFactoryEn: string
    productTypeCode: string
    productType: string
    productTypeEn: string
    batteryTypeCode: string
    batteryType: string
    batteryTypeEn: string
    dateCode: string
    productionDate: string
  }
  ladderCode: string
  separator: string
  checksum: string
  compositeKey: string
  miCode: string
  miCodeInfo: {
    project: string
    supplier: string
    cellModel: string
  }
  variable: string
}

export interface BatteryIdInfo {
  statusCode: number
  index: number
  raw: string
  parsed: BatteryIdParsed | null
}

export interface TempModelInfo {
  statusCode: number
  success: boolean
  highTemp: number | null
  lowTemp: number | null
  batteryModel: string
}

export interface Qi2Status {
  statusCode: number
  success: boolean
  enabled: boolean
  rawPayload: Uint8Array
}

export interface Qi2EnableResult {
  statusCode: number
  success: boolean
  rawPayload: Uint8Array
}

export interface HistoryRecord {
  timestamp: number
  cellId: number
  chargeState: number
  errorType: number
  value: number
}

export type ConnectionStatus =
  'idle' | 'connecting' | 'connected' | 'demo' | 'unavailable' | 'error'

export type LogDirection = 'tx' | 'rx' | 'info' | 'error'

export interface ProtocolLogEntry {
  id: number
  at: number
  direction: LogDirection
  label: string
  hex?: string
  detail?: string
}

export interface TransportInfo {
  productName: string
  vendorId: number
  productId: number
  serialNumber?: string
}
