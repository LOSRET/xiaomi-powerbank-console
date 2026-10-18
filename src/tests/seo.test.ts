import { describe, expect, it } from 'vitest'
import { VISIBLE_MODELS } from '@/data/models'
import {
  ROUTE_SEO,
  SITE_URL,
  absoluteUrl,
  buildStructuredData,
  seoForRoute,
  serializeJsonLd,
} from '@/seo/site'

describe('SEO route metadata', () => {
  it('resolves every route to a complete metadata set', () => {
    for (const seo of Object.values(ROUTE_SEO)) {
      for (const lang of ['zh-CN', 'en'] as const) {
        expect(seo.title[lang].length).toBeGreaterThan(10)
        expect(seo.keywords[lang].length).toBeGreaterThanOrEqual(3)
        if (seo.index) {
          expect(seo.description[lang].length).toBeGreaterThan(40)
        }
      }
      expect(seo.path.startsWith('/')).toBe(true)
    }
  })

  it('falls back to the home metadata for unknown routes', () => {
    expect(seoForRoute('unknown')).toBe(ROUTE_SEO.home)
    expect(seoForRoute(undefined)).toBe(ROUTE_SEO.home)
  })

  it('builds absolute canonical URLs', () => {
    expect(absoluteUrl('/models')).toBe(`${SITE_URL}/models`)
    expect(absoluteUrl('models')).toBe(`${SITE_URL}/models`)
  })

  it('marks the 404 route as non-indexable', () => {
    expect(ROUTE_SEO['not-found'].index).toBe(false)
    expect(buildStructuredData('not-found', 'zh-CN')).toBeNull()
  })
})

describe('structured data', () => {
  it('describes the application on the home page', () => {
    const data = buildStructuredData('home', 'zh-CN')
    const graph = data?.['@graph'] as Array<Record<string, unknown>>

    expect(graph.map((item) => item['@type'])).toEqual(['WebSite', 'WebApplication'])
  })

  it('lists every visible model on the models page', () => {
    const data = buildStructuredData('models', 'en')
    const graph = data?.['@graph'] as Array<Record<string, unknown>>
    const list = graph.find((item) => item['@type'] === 'ItemList')

    expect(list?.numberOfItems).toBe(VISIBLE_MODELS.length)
    expect((list?.itemListElement as unknown[]).length).toBe(VISIBLE_MODELS.length)
  })

  it('provides FAQ and breadcrumb markup for the guide', () => {
    const data = buildStructuredData('guide', 'zh-CN')
    const graph = data?.['@graph'] as Array<Record<string, unknown>>

    expect(graph.some((item) => item['@type'] === 'FAQPage')).toBe(true)
    expect(graph.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('escapes script-breaking characters in serialized JSON-LD', () => {
    const serialized = serializeJsonLd({ value: '</script>' })
    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c')
  })
})
