import type { TransportInfo } from '@/types/device'

export interface HidTransport {
  readonly info: TransportInfo
  readonly kind: 'webhid' | 'demo'
  open(): Promise<void>
  close(): Promise<void>
  send(frame: Uint8Array): Promise<void>
  onInputReport(listener: (data: Uint8Array) => void): () => void
  onDisconnect(listener: () => void): () => void
}
