import { VISIBLE_MODELS } from '../data/models'

export const SITE_URL = 'https://xiaomipowerbank.neko2.top'
export const GITHUB_URL = 'https://github.com/LOSRET/xiaomi-powerbank-console'
export const OG_IMAGE_PATH = '/og-image.png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export type SeoLang = 'zh-CN' | 'en'
export type SeoRouteName = 'home' | 'models' | 'guide' | 'not-found'

export interface LocalizedText {
  'zh-CN': string
  en: string
}

export interface RouteSeo {
  path: string
  index: boolean
  title: LocalizedText
  description: LocalizedText
  keywords: LocalizedText
  changeFrequency: 'weekly' | 'monthly'
  priority: number
}

export const SITE_NAME: LocalizedText = {
  'zh-CN': '小米移动电源详情',
  en: 'Xiaomi Power Bank Console',
}

export const OG_IMAGE_ALT: LocalizedText = {
  'zh-CN': '小米移动电源详情：电池健康度、循环次数与电芯数据',
  en: 'Xiaomi Power Bank Console: battery health, cycle count and cell data',
}

export const ROUTE_SEO: Record<SeoRouteName, RouteSeo> = {
  home: {
    path: '/',
    index: true,
    title: {
      'zh-CN': '小米移动电源详情 - 在线查看电池健康、循环次数与温度',
      en: 'Xiaomi Power Bank Console - Battery Health, Cycles & Temperature',
    },
    description: {
      'zh-CN':
        '通过 WebHID 在浏览器中连接小米移动电源，读取电池健康度、循环次数、温度、电芯电压与异常记录。无需安装驱动，数据仅在本机处理。',
      en: 'Connect a Xiaomi power bank over WebHID to inspect battery health, cycle count, temperature, cell voltages and anomaly logs in your browser. No drivers, no uploads.',
    },
    keywords: {
      'zh-CN': '小米移动电源,小米充电宝,电池健康度,循环次数,电池温度,WebHID,电芯电压,充电宝检测',
      en: 'Xiaomi power bank, battery health, cycle count, WebHID, power bank checker, battery temperature',
    },
    changeFrequency: 'weekly',
    priority: 1,
  },
  models: {
    path: '/models',
    index: true,
    title: {
      'zh-CN': '支持的小米移动电源型号与 USB-C 接口 - 小米移动电源详情',
      en: 'Supported Xiaomi Power Bank Models & USB-C Ports',
    },
    description: {
      'zh-CN':
        '查看本工具支持的小米移动电源型号、指定 USB-C 接口与工作温度，包括 WPB1025S、WPB1026S、PB2045MI、PB2067MI、P25 等。',
      en: 'See which Xiaomi power bank models this WebHID console supports, along with their designated USB-C ports and operating temperatures.',
    },
    keywords: {
      'zh-CN': '小米移动电源型号,小米充电宝型号,USB-C 接口,WPB1025S,WPB1026S,PB2045MI,PB2067MI',
      en: 'Xiaomi power bank models, USB-C port, WPB1025S, WPB1026S, PB2045MI, PB2067MI, WebHID',
    },
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  guide: {
    path: '/exception-guide',
    index: true,
    title: {
      'zh-CN': '小米移动电源充电高温、放电高温与过压异常处理指引',
      en: 'Xiaomi Power Bank Overheating & Overvoltage Troubleshooting',
    },
    description: {
      'zh-CN':
        '小米移动电源出现充电高温、放电高温或过压异常时怎么办？了解自动保护机制、冷却方法、配件排查与售后建议。',
      en: 'What to do when a Xiaomi power bank overheats while charging or discharging, or reports overvoltage. Learn about protection, cooling and accessory checks.',
    },
    keywords: {
      'zh-CN': '小米移动电源异常,充电高温,放电高温,过压保护,充电宝温度,充电宝售后',
      en: 'Xiaomi power bank overheating, overvoltage, high temperature, power bank troubleshooting',
    },
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  'not-found': {
    path: '/404',
    index: false,
    title: {
      'zh-CN': '页面不存在 - 小米移动电源详情',
      en: 'Page not found - Xiaomi Power Bank Console',
    },
    description: {
      'zh-CN': '你访问的页面不存在，请返回设备页查看小米移动电源数据。',
      en: 'The page you requested does not exist. Return to the device page to inspect your Xiaomi power bank.',
    },
    keywords: {
      'zh-CN': '页面不存在',
      en: 'page not found',
    },
    changeFrequency: 'monthly',
    priority: 0,
  },
}

const HOME_FEATURES: LocalizedText[] = [
  {
    'zh-CN': '读取电池健康度与循环次数',
    en: 'Battery health and cycle count',
  },
  {
    'zh-CN': '查看温度、串总电压与电流',
    en: 'Temperature, pack voltage and current',
  },
  {
    'zh-CN': '查看电芯电压、电芯编码与生产信息',
    en: 'Cell voltages, cell IDs and production data',
  },
  {
    'zh-CN': '读取移动电源本地异常记录',
    en: 'Anomaly records stored on the power bank',
  },
  {
    'zh-CN': '支持中英文界面与演示模式',
    en: 'Chinese and English UI with demo mode',
  },
]

const FAQS: Record<SeoLang, Array<{ question: string; answer: string }>> = {
  'zh-CN': [
    {
      question: '小米移动电源充电时温度过高怎么办？',
      answer:
        '建议先暂停充电，待冷却后再继续使用。若使用非原装配件，请更换为原装或合规的充电线与充电头。异常频繁出现时联系小米售后检修。',
    },
    {
      question: '小米移动电源放电时温度过高怎么办？',
      answer:
        '建议先暂停使用，待冷却后再继续。若使用非原装配件，请更换为原装或合规的充电线。异常频繁出现时联系小米售后检修。',
    },
    {
      question: '移动电源提示过压异常怎么处理？',
      answer: '建议先暂停使用，再重新插拔尝试恢复。若过压异常反复出现，请停止使用并联系售后检修。',
    },
    {
      question: '为什么小米移动电源会自动停止充放电？',
      answer:
        '当设备检测到温度或电压超出安全范围时，会自动启动保护并停止充放电。待温度恢复正常后通常可以继续使用。',
    },
  ],
  en: [
    {
      question: 'What should I do if my Xiaomi power bank gets too hot while charging?',
      answer:
        'Stop charging and let it cool down before using it again. Replace non-original accessories with original or certified cables and adapters. Contact Xiaomi support if this happens frequently.',
    },
    {
      question: 'What should I do if my Xiaomi power bank gets too hot while discharging?',
      answer:
        'Stop using the power bank and let it cool down. Replace non-original accessories with original or certified cables. Contact Xiaomi support if this happens frequently.',
    },
    {
      question: 'How do I handle an overvoltage warning?',
      answer:
        'Stop using the power bank and reconnect it to see whether the warning clears. If overvoltage warnings keep appearing, stop using the device and contact support.',
    },
    {
      question: 'Why does my Xiaomi power bank stop charging or discharging automatically?',
      answer:
        'The power bank activates protection when temperature or voltage exceeds the safe range. It normally becomes usable again after returning to a normal temperature.',
    },
  ],
}

export function seoForRoute(name: string | symbol | null | undefined): RouteSeo {
  if (typeof name === 'string' && name in ROUTE_SEO) {
    return ROUTE_SEO[name as SeoRouteName]
  }
  return ROUTE_SEO.home
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

export function buildStructuredData(
  name: SeoRouteName,
  lang: SeoLang,
): Record<string, unknown> | null {
  const route = ROUTE_SEO[name]
  if (!route.index) return null

  const otherLang: SeoLang = lang === 'zh-CN' ? 'en' : 'zh-CN'
  const url = absoluteUrl(route.path)
  const graph: Array<Record<string, unknown>> = []

  if (name === 'home') {
    graph.push(
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME[lang],
        alternateName: SITE_NAME[otherLang],
        url: `${SITE_URL}/`,
        description: route.description[lang],
        inLanguage: ['zh-CN', 'en'],
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#webapp`,
        name: SITE_NAME[lang],
        alternateName: SITE_NAME[otherLang],
        url,
        description: route.description[lang],
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Windows, macOS, Linux, ChromeOS',
        browserRequirements: 'Requires WebHID in a secure context (HTTPS or localhost)',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        inLanguage: ['zh-CN', 'en'],
        featureList: HOME_FEATURES.map((feature) => feature[lang]),
        screenshot: absoluteUrl(OG_IMAGE_PATH),
        codeRepository: GITHUB_URL,
        license: `${GITHUB_URL}/blob/main/LICENSE`,
      },
    )
  }

  if (name === 'models') {
    graph.push(
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          breadcrumbItem(1, SITE_NAME[lang], '/'),
          breadcrumbItem(2, route.title[lang], route.path),
        ],
      },
      {
        '@type': 'ItemList',
        name: route.title[lang],
        numberOfItems: VISIBLE_MODELS.length,
        itemListElement: VISIBLE_MODELS.map((model, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${lang === 'en' ? model.nameEn : model.name} (${model.model})`,
          description:
            lang === 'en'
              ? `Designated USB-C port: ${model.connection}; operating temperature: ${model.tempRange}`
              : `指定 USB-C 口：${model.connection}；工作温度：${model.tempRange}`,
        })),
      },
    )
  }

  if (name === 'guide') {
    graph.push(
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          breadcrumbItem(1, SITE_NAME[lang], '/'),
          breadcrumbItem(2, route.title[lang], route.path),
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS[lang].map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    )
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

function breadcrumbItem(position: number, name: string, path: string): Record<string, unknown> {
  return {
    '@type': 'ListItem',
    position,
    name,
    item: absoluteUrl(path),
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
