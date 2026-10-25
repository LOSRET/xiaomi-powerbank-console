import { describe, expect, it } from 'vitest'
import type { ProtocolLogEntry } from '@/types/device'
import { DeviceClient } from '@/lib/hid/device-client'
import { MockTransport } from '@/lib/hid/mock-transport'

describe('DeviceClient with the demo transport', () => {
  it('runs the full handshake and data sequence', async () => {
    const transport = new MockTransport()
    const logs: Omit<ProtocolLogEntry, 'id' | 'at'>[] = []
    const client = new DeviceClient(transport, {
      onLog: (entry) => logs.push(entry),
    })

    await client.open()
    const hello = await client.handshake()
    expect(hello.modelId).toBe(9)
    expect(hello.serialNumber).toBe('DMPB1025S0001')

    const battery = await client.getBatteryInfo()
    expect(battery.level).toBe(86)
    expect(battery.cellCount).toBe(2)
    expect(battery.health).toBe(97)

    const cells = await client.getCellStatus(2)
    expect(cells).toHaveLength(2)
    expect(cells[0]?.voltage).toBe(3852)

    const id = await client.getBatteryId(1)
    expect(id.raw).toBe('ATLNDAG3F-1D9A26A0123')
    expect(id.parsed?.miCodeInfo.cellModel).toBe('436678B')

    const temperature = await client.getTempModel()
    expect(temperature.highTemp).toBe(60)
    expect(temperature.lowTemp).toBe(-20)

    const qi2 = await client.getQi2Status()
    expect(qi2.enabled).toBe(false)
    const enableResult = await client.setQi2(true)
    expect(enableResult.success).toBe(true)
    expect((await client.getQi2Status()).enabled).toBe(true)
    const disableResult = await client.setQi2(false)
    expect(disableResult.success).toBe(true)
    expect((await client.getQi2Status()).enabled).toBe(false)

    const history = await client.getHistory(1, 7)
    expect(history).toHaveLength(3)
    expect(history[0]?.errorType).toBe(3)

    await client.sendHeartbeat()
    await client.disconnect()

    expect(transport.info.productName).toContain('Demo')
    expect(logs.some((entry) => entry.direction === 'tx')).toBe(true)
    expect(logs.some((entry) => entry.direction === 'rx')).toBe(true)
  })

  it('rejects a request when the transport is closed', async () => {
    const client = new DeviceClient(new MockTransport())
    await expect(client.getBatteryInfo()).rejects.toThrow('not connected')
  })
})
