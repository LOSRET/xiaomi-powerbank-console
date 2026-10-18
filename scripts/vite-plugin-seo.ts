import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { VISIBLE_MODELS } from '../src/data/models'
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  ROUTE_SEO,
  SITE_NAME,
  absoluteUrl,
  buildStructuredData,
  escapeHtml,
  serializeJsonLd,
  type SeoLang,
  type SeoRouteName,
} from '../src/seo/site'

const STATIC_LANG: SeoLang = 'zh-CN'

const STATIC_ROUTES: Array<{ name: SeoRouteName; file: string }> = [
  { name: 'home', file: 'index.html' },
  { name: 'models', file: 'models.html' },
  { name: 'guide', file: 'exception-guide.html' },
  { name: 'not-found', file: '404.html' },
]

const SITEMAP_ROUTES: SeoRouteName[] = ['home', 'models', 'guide']

/**
 * Writes route-specific static HTML shells and a sitemap after the Vite build.
 * The shells keep the same Vue entry point, but give crawlers, social previews
 * and no-JavaScript visitors a useful title, description, canonical URL and
 * readable fallback content without duplicating the app implementation.
 */
export function seoPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'xiaomi-power-bank-seo',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },
    closeBundle() {
      const outDir = resolve(config.root, config.build.outDir)
      const template = readFileSync(resolve(outDir, 'index.html'), 'utf8')

      for (const route of STATIC_ROUTES) {
        const html = renderShell(template, route.name)
        writeFileSync(resolve(outDir, route.file), html)
      }

      writeFileSync(resolve(outDir, 'sitemap.xml'), renderSitemap())
    },
  }
}

function renderShell(template: string, routeName: SeoRouteName): string {
  const seo = ROUTE_SEO[routeName]
  const title = seo.title[STATIC_LANG]
  const description = seo.description[STATIC_LANG]

  let html = template.replace(/<!--seo:head-->[\s\S]*?<!--\/seo:head-->/g, '')
  html = html.replace(/<!--seo:fallback-->[\s\S]*?<!--\/seo:fallback-->/g, '')

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  )

  html = html.replace(
    '</head>',
    `  <!--seo:head-->\n  ${buildHead(routeName)}\n  <!--/seo:head-->\n  </head>`,
  )

  const fallback = renderFallback(routeName)
  if (fallback) {
    html = html.replace(
      '</body>',
      `  <!--seo:fallback-->\n  <noscript>${fallback}</noscript>\n  <!--/seo:fallback-->\n  </body>`,
    )
  }

  return html
}

function buildHead(routeName: SeoRouteName): string {
  const seo = ROUTE_SEO[routeName]
  const title = seo.title[STATIC_LANG]
  const description = seo.description[STATIC_LANG]
  const canonical = absoluteUrl(seo.path)
  const image = absoluteUrl(OG_IMAGE_PATH)
  const lines = [
    `<meta name="keywords" content="${escapeHtml(seo.keywords[STATIC_LANG])}" />`,
    `<meta name="robots" content="${seo.index ? 'index,follow,max-image-preview:large' : 'noindex,nofollow'}" />`,
  ]

  if (seo.index) {
    lines.push(`<link rel="canonical" href="${canonical}" />`)
  }

  lines.push(
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME[STATIC_LANG])}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${seo.index ? canonical : absoluteUrl('/404')}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:type" content="image/png" />',
    `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT[STATIC_LANG])}" />`,
    '<meta property="og:locale" content="zh_CN" />',
    '<meta property="og:locale:alternate" content="en_US" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(OG_IMAGE_ALT[STATIC_LANG])}" />`,
  )

  const structuredData = buildStructuredData(routeName, STATIC_LANG)
  if (structuredData) {
    lines.push(
      `<script id="seo-structured-data" type="application/ld+json">${serializeJsonLd(structuredData)}</script>`,
    )
  }

  return lines.join('\n  ')
}

function renderFallback(routeName: SeoRouteName): string {
  switch (routeName) {
    case 'home':
      return renderHomeFallback()
    case 'models':
      return renderModelsFallback()
    case 'guide':
      return renderGuideFallback()
    case 'not-found':
      return renderNotFoundFallback()
  }
}

function renderHomeFallback(): string {
  return `
    <div class="no-js-seo page-shell">
      <article class="no-js-seo__card card">
        <p class="no-js-seo__kicker mono">WebHID · 本机读取</p>
        <h1>连接你的小米移动电源</h1>
        <p>在桌面版 Chrome、Edge 或 Opera 中连接小米移动电源，查看电池健康度、循环次数、温度、电芯电压和本地异常记录。无需安装驱动，数据仅在浏览器内处理。</p>
        <h2>可读取的数据</h2>
        <ul>
          <li>电量、充放电状态、电池健康度与循环次数</li>
          <li>电池温度、串总电压、电流与电芯电压</li>
          <li>产品型号、SN、电池型号、生产日期与电芯编码</li>
          <li>移动电源本地保存的异常记录</li>
        </ul>
        <h2>连接步骤</h2>
        <ol>
          <li>使用支持数据传输的 USB-C 线连接移动电源的指定接口。</li>
          <li>在 4 秒内连续快速按 8 次移动电源按键，进入数据传输模式。</li>
          <li>点击页面上的「建立连接」，在浏览器弹窗中选择 XiaomiPowerBank。</li>
        </ol>
        <h2>支持型号与异常处理</h2>
        <p>不同型号的指定 USB-C 接口不同，完整列表见<a href="/models">支持型号与接口</a>。遇到充电高温、放电高温或过压提示时，可查看<a href="/exception-guide">常见异常及处理指引</a>。</p>
        <p class="no-js-seo__note">本工具为非官方工具，与小米公司无隶属关系。没有设备时可在页面中查看演示数据。</p>
      </article>
    </div>`
}

function renderModelsFallback(): string {
  const items = VISIBLE_MODELS.map(
    (model) =>
      `<li><strong>${escapeHtml(model.name)}</strong>（${escapeHtml(model.model)}）· 指定 USB-C 口：${escapeHtml(model.connection)} · 工作温度：${escapeHtml(model.tempRange)}</li>`,
  ).join('\n          ')

  return `
    <div class="no-js-seo page-shell">
      <article class="no-js-seo__card card">
        <p class="no-js-seo__kicker mono">WebHID · 支持型号</p>
        <h1>支持的小米移动电源型号</h1>
        <p>本工具支持以下 ${VISIBLE_MODELS.length} 款小米移动电源。请使用数据线连接表中标注的指定 USB-C 口；部分型号的接口位置不同，具体以产品说明为准。</p>
        <ul class="no-js-seo__models">
          ${items}
        </ul>
        <p><a href="/">返回设备页</a> · <a href="/exception-guide">常见异常及处理指引</a></p>
      </article>
    </div>`
}

function renderGuideFallback(): string {
  return `
    <div class="no-js-seo page-shell">
      <article class="no-js-seo__card card">
        <p class="no-js-seo__kicker mono">WebHID · 异常处理</p>
        <h1>常见异常及处理指引</h1>
        <p>当移动电源检测到温度、电压超出安全范围时，会自动启动保护并停止充放电。以下是常见异常的处理方法。</p>
        <h2>充电高温异常</h2>
        <p>建议先暂停充电，待冷却后再继续使用。若使用非原装配件，请更换为原装或合规的充电线与充电头。</p>
        <h2>放电高温异常</h2>
        <p>建议先暂停使用，待冷却后再继续使用。若使用非原装配件，请更换为原装或合规的充电线。</p>
        <h2>过压异常</h2>
        <p>建议先暂停使用，再重新插拔尝试恢复。若异常频繁出现，可能是移动电源硬件故障，建议及时联系售后检修。</p>
        <h2>为什么设备会自动停止充放电？</h2>
        <p>设备检测到温度或电压超出安全范围时会触发保护。待温度恢复正常后通常可以继续使用；异常频繁出现时请优先联系小米售后。</p>
        <p><a href="/">返回设备页</a> · <a href="/models">支持型号与接口</a></p>
      </article>
    </div>`
}

function renderNotFoundFallback(): string {
  return `
    <div class="no-js-seo page-shell">
      <article class="no-js-seo__card card">
        <p class="no-js-seo__kicker mono">404 / 0xA5</p>
        <h1>页面不存在</h1>
        <p>你访问的页面不存在，请返回设备页查看小米移动电源数据。</p>
        <p><a href="/">返回设备页</a> · <a href="/models">支持型号</a> · <a href="/exception-guide">异常处理指引</a></p>
      </article>
    </div>`
}

function renderSitemap(): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = SITEMAP_ROUTES.map((name) => {
    const seo = ROUTE_SEO[name]
    return `  <url>
    <loc>${escapeXml(absoluteUrl(seo.path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${seo.changeFrequency}</changefreq>
    <priority>${seo.priority.toFixed(1)}</priority>
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
