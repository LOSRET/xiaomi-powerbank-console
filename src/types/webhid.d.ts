/**
 * Minimal WebHID typings. TypeScript's DOM library does not ship WebHID
 * definitions yet, so the small surface used by this project is declared here.
 */
interface HIDReportItem {
  reportId?: number
  reportSize?: number
  reportCount?: number
  isAbsolute?: boolean
  hasNull?: boolean
  usages?: readonly number[]
  logicalMinimum?: number
  logicalMaximum?: number
  physicalMinimum?: number
  physicalMaximum?: number
  unitExponent?: number
  unit?: number
}

interface HIDReportInfo {
  reportId?: number
  items?: readonly HIDReportItem[]
}

interface HIDCollectionInfo {
  usagePage?: number
  usage?: number
  type?: number
  children?: readonly HIDCollectionInfo[]
  inputReports?: readonly HIDReportInfo[]
  outputReports?: readonly HIDReportInfo[]
  featureReports?: readonly HIDReportInfo[]
}

interface HIDInputReportEvent extends Event {
  readonly data: DataView
  readonly device: HIDDevice
  readonly reportId: number
}

interface HIDConnectionEvent extends Event {
  readonly device: HIDDevice
}

interface HIDDevice extends EventTarget {
  readonly opened: boolean
  readonly vendorId: number
  readonly productId: number
  readonly productName: string
  readonly collections: readonly HIDCollectionInfo[]
  open(): Promise<void>
  close(): Promise<void>
  forget(): Promise<void>
  sendReport(reportId: number, data: BufferSource): Promise<void>
  sendFeatureReport(reportId: number, data: BufferSource): Promise<void>
  receiveFeatureReport(reportId: number): Promise<DataView>
  addEventListener(
    type: 'inputreport',
    listener: (this: HIDDevice, event: HIDInputReportEvent) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
  removeEventListener(
    type: 'inputreport',
    listener: (this: HIDDevice, event: HIDInputReportEvent) => void,
    options?: boolean | EventListenerOptions,
  ): void
}

interface HIDDeviceFilter {
  vendorId?: number
  productId?: number
  usagePage?: number
  usage?: number
}

interface HIDDeviceRequestOptions {
  filters: HIDDeviceFilter[]
  exclusionFilters?: HIDDeviceFilter[]
}

interface HID extends EventTarget {
  getDevices(): Promise<HIDDevice[]>
  requestDevice(options: HIDDeviceRequestOptions): Promise<HIDDevice[]>
  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: HID, event: HIDConnectionEvent) => void,
    options?: boolean | AddEventListenerOptions,
  ): void
  removeEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: HID, event: HIDConnectionEvent) => void,
    options?: boolean | EventListenerOptions,
  ): void
}

interface Navigator {
  readonly hid: HID
}
