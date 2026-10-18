import { computed, ref } from 'vue'
import type { Lang } from '@/types/device'
import { MESSAGES } from '@/data/i18n'
import type { MessageKey } from '@/data/i18n/zh-CN'

const STORAGE_KEY = 'xiaomi-powerbank-lang'

function getInitialLanguage(): Lang {
  if (typeof window === 'undefined') return 'zh-CN'

  const query = new URLSearchParams(window.location.search).get('lang')
  if (query) {
    if (query.toLowerCase().startsWith('en')) return 'en'
    if (query.toLowerCase().startsWith('zh')) return 'zh-CN'
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh-CN') return saved
  } catch {
    // Storage can be unavailable in private browsing.
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

const language = ref<Lang>(getInitialLanguage())

function applyDocumentLanguage(lang: Lang): void {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
}

applyDocumentLanguage(language.value)

export function useI18n() {
  const lang = computed(() => language.value)
  const isEnglish = computed(() => language.value === 'en')

  function setLanguage(next: Lang): void {
    language.value = next
    applyDocumentLanguage(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode can make localStorage unavailable.
    }
  }

  function toggleLanguage(): void {
    setLanguage(language.value === 'en' ? 'zh-CN' : 'en')
  }

  function t(key: MessageKey | string, params?: Record<string, string | number>): string {
    const messages = MESSAGES[language.value]
    const fallback = MESSAGES.en
    let value = messages[key as MessageKey] ?? fallback[key as MessageKey] ?? key

    if (params) {
      for (const [name, replacement] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${escapeRegExp(name)}\\}`, 'g'), String(replacement))
      }
    }

    return value
  }

  function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(language.value === 'en' ? 'en-GB' : 'zh-CN', options).format(value)
  }

  return {
    lang,
    isEnglish,
    setLanguage,
    toggleLanguage,
    t,
    formatNumber,
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
