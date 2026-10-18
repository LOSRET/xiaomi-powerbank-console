import type { ParsedFrame } from './types'
import { crc8 } from './crc8'
import { CMD, HEAD, HID_FRAME_SIZE } from './constants'

export interface ExtractedFrames {
  frames: ParsedFrame[]
  remaining: Uint8Array
}

export function bytesToHex(data: Uint8Array, spaced = false): string {
  const value = Array.from(data, (byte) => byte.toString(16).padStart(2, '0').toUpperCase())
  return spaced ? value.join(' ') : value.join('')
}

export function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.replace(/[^0-9a-f]/gi, '')
  if (normalized.length % 2 !== 0)
    throw new Error('Hex string must contain an even number of digits')
  const bytes = new Uint8Array(normalized.length / 2)
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(normalized.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

export function buildCommandFrame(
  command: number,
  payload: Uint8Array<ArrayBufferLike> = new Uint8Array(),
): Uint8Array<ArrayBuffer> {
  if (payload.length > HID_FRAME_SIZE - 4) {
    throw new Error(`Payload is too long: ${payload.length} bytes`)
  }

  const body = new Uint8Array(3 + payload.length)
  body[0] = HEAD
  body[1] = command
  body[2] = payload.length
  body.set(payload, 3)

  const frame = new Uint8Array(HID_FRAME_SIZE)
  frame.set(body)
  frame[body.length] = crc8(body)
  return frame
}

/**
 * The handshake frame has a fixed layout rather than the generic
 * HEAD/CMD/LEN/PAYLOAD/CRC shape. It carries a Beijing-time timestamp and the
 * ASCII magic "xiaomi-pb".
 */
export function buildHelloFrame(now = Date.now()): Uint8Array {
  const frame = new Uint8Array(HID_FRAME_SIZE)
  frame[0] = HEAD
  frame[1] = CMD.HELLO
  frame[2] = 13

  const timestamp = Math.floor(now / 1000) + 8 * 60 * 60
  frame[3] = timestamp & 0xff
  frame[4] = (timestamp >>> 8) & 0xff
  frame[5] = (timestamp >>> 16) & 0xff
  frame[6] = (timestamp >>> 24) & 0xff

  const magic = new TextEncoder().encode('xiaomi-pb')
  frame.set(magic, 7)
  frame[16] = crc8(frame.subarray(0, 16))
  return frame
}

export function parseFrame(data: Uint8Array, verifyCrc = true): ParsedFrame {
  if (data.length < 4) throw new Error(`Frame is too short: ${data.length} bytes`)
  if (data[0] !== HEAD) {
    throw new Error(`Unexpected frame head: 0x${(data[0] ?? 0).toString(16).toUpperCase()}`)
  }

  const declaredLength = data[2] ?? 0
  const availablePayload = Math.max(0, data.length - 4)
  if (declaredLength > availablePayload) {
    throw new Error(`Declared payload length (${declaredLength}) exceeds frame data`)
  }

  const payload = data.slice(3, 3 + declaredLength)
  const checksum = data[3 + declaredLength] ?? 0
  const expected = crc8(data.slice(0, 3 + declaredLength))

  return {
    head: data[0] ?? HEAD,
    command: data[1] ?? 0,
    dataLength: declaredLength,
    payload,
    checksum,
    crcValid: !verifyCrc || checksum === expected,
    expectedChecksum: expected,
    raw: data.slice(0, 4 + declaredLength),
  }
}

/**
 * Input reports may contain a complete frame, a partial frame, zero padding or
 * more than one frame. Keep the tail in a rolling buffer.
 */
export function extractFrames(buffer: Uint8Array): ExtractedFrames {
  const frames: ParsedFrame[] = []
  let offset = 0

  while (offset < buffer.length) {
    if (buffer[offset] !== HEAD) {
      offset += 1
      continue
    }

    if (buffer.length - offset < 3) break

    const payloadLength = buffer[offset + 2] ?? 0
    const totalLength = 3 + payloadLength + 1
    if (buffer.length - offset < totalLength) break

    const raw = buffer.slice(offset, offset + totalLength)
    try {
      frames.push(parseFrame(raw))
    } catch {
      // Ignore malformed fragments and continue scanning for the next head.
    }
    offset += totalLength
  }

  return { frames, remaining: buffer.slice(offset) }
}
