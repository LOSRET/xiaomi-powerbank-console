import { describe, expect, it } from 'vitest'
import { crc8 } from '@/lib/protocol/crc8'
import {
  buildCommandFrame,
  buildHelloFrame,
  bytesToHex,
  extractFrames,
  hexToBytes,
  parseFrame,
} from '@/lib/protocol/frames'
import { CMD, HEAD, HID_FRAME_SIZE, RESPONSE_CMD } from '@/lib/protocol/constants'

describe('crc8', () => {
  it('matches the CRC-8/ATM variant used by the source decoder', () => {
    const bytes = hexToBytes('A5060100')
    expect(crc8(bytes)).toBe(0xd9)
  })
})

describe('frames', () => {
  it('builds a 32-byte command frame with CRC and zero padding', () => {
    const frame = buildCommandFrame(CMD.ENABLE_QI2, new Uint8Array([0]))
    expect(frame).toHaveLength(HID_FRAME_SIZE)
    expect(bytesToHex(frame.subarray(0, 5))).toBe('A5060100D9')
    expect(Array.from(frame.subarray(5)).every((byte) => byte === 0)).toBe(true)
  })

  it('builds the special Hello frame', () => {
    const now = Date.UTC(2026, 8, 12, 12, 0, 0)
    const frame = buildHelloFrame(now)
    expect(frame).toHaveLength(HID_FRAME_SIZE)
    expect(frame[0]).toBe(HEAD)
    expect(frame[1]).toBe(CMD.HELLO)
    expect(frame[2]).toBe(13)
    expect(bytesToHex(frame.subarray(7, 16))).toBe('7869616F6D692D7062')
    expect(frame[16]).toBe(crc8(frame.subarray(0, 16)))
  })

  it('parses responses and flags bad CRC', () => {
    const payload = new Uint8Array([0, 1, 2, 3])
    const frame = buildCommandFrame(RESPONSE_CMD.BATTERY_INFO, payload)
    const parsed = parseFrame(frame)
    expect(parsed.command).toBe(RESPONSE_CMD.BATTERY_INFO)
    expect(Array.from(parsed.payload)).toEqual([0, 1, 2, 3])
    expect(parsed.crcValid).toBe(true)

    const broken = new Uint8Array(frame)
    broken[3] ^= 0xff
    expect(parseFrame(broken).crcValid).toBe(false)
  })

  it('extracts multiple frames from a padded report', () => {
    const first = buildCommandFrame(RESPONSE_CMD.BATTERY_INFO, new Uint8Array([1, 2]))
    const second = buildCommandFrame(RESPONSE_CMD.CELL_STATUS, new Uint8Array([3]))
    const merged = new Uint8Array(64)
    merged.set(first)
    merged.set(second, 32)
    const { frames, remaining } = extractFrames(merged)
    expect(frames).toHaveLength(2)
    expect(frames[0]?.command).toBe(RESPONSE_CMD.BATTERY_INFO)
    expect(frames[1]?.command).toBe(RESPONSE_CMD.CELL_STATUS)
    expect(remaining).toHaveLength(0)
  })

  it('keeps an incomplete tail', () => {
    const frame = buildCommandFrame(RESPONSE_CMD.CELL_STATUS, new Uint8Array(10))
    const { frames, remaining } = extractFrames(frame.subarray(0, 10))
    expect(frames).toHaveLength(0)
    expect(remaining).toHaveLength(10)
  })
})
