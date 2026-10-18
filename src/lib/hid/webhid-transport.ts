import type { TransportInfo } from '@/types/device'
import { VENDOR_IDS } from '@/lib/protocol/constants'
import type { HidTransport } from './transport'

export class WebHidTransport implements HidTransport {
  readonly kind = 'webhid' as const
  readonly info: TransportInfo
  private readonly device: HIDDevice
  private readonly reportListeners = new Set<(data: Uint8Array) => void>()
  private readonly disconnectListeners = new Set<() => void>()
  private readonly handleInputReport: (event: HIDInputReportEvent) => void
  private readonly handleNativeDisconnect: (event: HIDConnectionEvent) => void

  private constructor(device: HIDDevice) {
    this.device = device
    this.info = {
      productName: device.productName || 'XiaomiPowerBank',
      vendorId: device.vendorId,
      productId: device.productId,
    }
    this.handleInputReport = (event) => {
      const data = new Uint8Array(event.data.byteLength)
      data.set(new Uint8Array(event.data.buffer, event.data.byteOffset, event.data.byteLength))
      for (const listener of this.reportListeners) listener(data)
    }
    this.handleNativeDisconnect = (event) => {
      if (event.device !== this.device) return
      for (const listener of this.disconnectListeners) listener()
    }
  }

  static isSupported(): boolean {
    if (typeof navigator === 'undefined' || !('hid' in navigator)) return false
    if (typeof window === 'undefined') return false
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
    const touchDesktop = window.screen.width < 768 && navigator.maxTouchPoints > 0
    return !mobile && !touchDesktop
  }

  /**
   * Must be called directly from a user gesture (a click). It opens the
   * browser's HID device chooser and returns null when the user cancels.
   */
  static async request(): Promise<WebHidTransport | null> {
    if (!WebHidTransport.isSupported()) {
      throw new Error('WebHID is not available in this browser')
    }

    const devices = await navigator.hid.requestDevice({
      filters: VENDOR_IDS.map((vendorId) => ({ vendorId })),
    })
    if (devices.length === 0) return null

    const device = devices[0]
    if (!device) return null
    const transport = new WebHidTransport(device)
    await transport.open()
    return transport
  }

  async open(): Promise<void> {
    if (!this.device.opened) await this.device.open()
    this.device.addEventListener('inputreport', this.handleInputReport)
    navigator.hid.addEventListener('disconnect', this.handleNativeDisconnect)
  }

  async close(): Promise<void> {
    this.device.removeEventListener('inputreport', this.handleInputReport)
    navigator.hid.removeEventListener('disconnect', this.handleNativeDisconnect)
    if (this.device.opened) {
      try {
        await this.device.close()
      } catch {
        // The cable may already be unplugged.
      }
    }
  }

  async send(frame: Uint8Array<ArrayBufferLike>): Promise<void> {
    if (!this.device.opened) throw new Error('HID device is not open')
    const report = new Uint8Array(frame.length)
    report.set(frame)
    await this.device.sendReport(0, report)
  }

  onInputReport(listener: (data: Uint8Array) => void): () => void {
    this.reportListeners.add(listener)
    return () => this.reportListeners.delete(listener)
  }

  onDisconnect(listener: () => void): () => void {
    this.disconnectListeners.add(listener)
    return () => this.disconnectListeners.delete(listener)
  }
}
