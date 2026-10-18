import { en } from './en'
import { zhCN, type MessageKey } from './zh-CN'
import type { Lang } from '@/types/device'

export const MESSAGES: Record<Lang, Record<MessageKey, string>> = {
  'zh-CN': zhCN,
  en,
}

export type { MessageKey }
