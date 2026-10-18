import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from './useI18n'
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  absoluteUrl,
  buildStructuredData,
  seoForRoute,
  serializeJsonLd,
  type SeoLang,
  type SeoRouteName,
} from '@/seo/site'

const STRUCTURED_DATA_ID = 'seo-structured-data'

/**
 * Keeps the document head in sync with the active route and language.
 * The same values are baked into the static HTML shells at build time so
 * crawlers and social previews do not depend on JavaScript.
 */
export function useSeo(): void {
  const route = useRoute()
  const { lang } = useI18n()

  watchEffect(() => {
    if (typeof document === 'undefined') return

    const routeName = (typeof route.name === 'string' ? route.name : 'home') as SeoRouteName
    const seo = seoForRoute(routeName)
    const currentLang: SeoLang = lang.value === 'en' ? 'en' : 'zh-CN'
    const title = seo.title[currentLang]
    const description = seo.description[currentLang]
    const canonical = absoluteUrl(seo.path)
    const ogImage = absoluteUrl(OG_IMAGE_PATH)
    const currentUrl = seo.index
      ? canonical
      : `${window.location.origin}${window.location.pathname}`

    document.title = title
    document.documentElement.lang = currentLang

    setMeta('name', 'description', description)
    setMeta('name', 'keywords', seo.keywords[currentLang])
    setMeta(
      'name',
      'robots',
      seo.index ? 'index,follow,max-image-preview:large' : 'noindex,nofollow',
    )

    setCanonical(seo.index ? canonical : '')

    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME[currentLang])
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', currentUrl)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:image:type', 'image/png')
    setMeta('property', 'og:image:width', String(OG_IMAGE_WIDTH))
    setMeta('property', 'og:image:height', String(OG_IMAGE_HEIGHT))
    setMeta('property', 'og:image:alt', OG_IMAGE_ALT[currentLang])
    setMeta('property', 'og:locale', currentLang === 'en' ? 'en_US' : 'zh_CN')
    setMeta('property', 'og:locale:alternate', currentLang === 'en' ? 'zh_CN' : 'en_US')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)
    setMeta('name', 'twitter:image:alt', OG_IMAGE_ALT[currentLang])

    setStructuredData(buildStructuredData(routeName, currentLang))
  })
}

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.setAttribute('content', content)
}

function setCanonical(href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!href) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }

  element.href = href
}

function setStructuredData(data: Record<string, unknown> | null): void {
  let element = document.getElementById(STRUCTURED_DATA_ID) as HTMLScriptElement | null

  if (!data) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('script')
    element.id = STRUCTURED_DATA_ID
    element.type = 'application/ld+json'
    document.head.append(element)
  }

  element.textContent = serializeJsonLd(data)
}
