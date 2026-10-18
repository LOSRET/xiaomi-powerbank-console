export const HID_FRAME_SIZE = 32
export const HEAD = 0xa5
export const REPORT_ID = 0

export const VENDOR_IDS = [0x2717, 0x1a86] as const

export const CMD = {
  HELLO: 0x00,
  GET_BATTERY_INFO: 0x01,
  GET_CELL_STATUS: 0x02,
  GET_HISTORY: 0x03,
  GET_BATTERY_ID: 0x04,
  DISCONNECT: 0x05,
  ENABLE_QI2: 0x06,
  GET_QI2_STATUS: 0x07,
  GET_CELL_TEMP_MODEL: 0x08,
  HEARTBEAT: 0x0a,
} as const

export const RESPONSE_CMD = {
  HELLO: 0x10,
  BATTERY_INFO: 0x11,
  CELL_STATUS: 0x12,
  HISTORY: 0x13,
  BATTERY_ID: 0x14,
  ENABLE_QI2: 0x16,
  QI2_STATUS: 0x17,
  CELL_TEMP_MODEL: 0x18,
} as const

export const TIMEOUT = {
  HELLO: 1_500,
  COMMAND: 3_000,
  BATTERY_ID: 1_500,
  HISTORY: 2_000,
  QI2_WRITE: 5_000,
} as const
