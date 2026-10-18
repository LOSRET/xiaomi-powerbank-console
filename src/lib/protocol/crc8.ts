/**
 * CRC-8 with polynomial 0x07 (the same variant used by the Xiaomi power bank
 * HID protocol). This is intentionally written over bytes, not characters.
 */
export function crc8(data: Uint8Array): number {
  let crc = 0
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x80 ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff
    }
  }
  return crc
}
