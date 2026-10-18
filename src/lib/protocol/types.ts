export interface ParsedFrame {
  head: number
  command: number
  dataLength: number
  payload: Uint8Array
  checksum: number
  crcValid: boolean
  expectedChecksum: number
  raw: Uint8Array
}
