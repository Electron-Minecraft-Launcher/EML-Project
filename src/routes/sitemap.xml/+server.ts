import { docsMenu } from '$lib/config/docs'
import type { RequestHandler } from './$types'

const site = 'https://emlproject.pages.dev'

export const GET: RequestHandler = async () => {
  const pages = ['', '/packages', '/packages/lib', '/packages/admintool']
  const docPages = docsMenu.flatMap((section) => section.items.map((item) => `/docs/${item.slug}`))
  const blogModules = import.meta.glob('/src/lib/blog/*.md', { eager: true })
  const blogPages = Object.entries(blogModules).map(([, mod]: any) => `/blog/${mod.metadata?.slug}`)

  const allPages = [...pages, ...docPages, ...blogPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allPages
    .map(
      (page) => `
<url>
<loc>${site}${page}</loc>
<changefreq>weekly</changefreq>
<priority>${page === '' ? 1.0 : 0.8}</priority>
</url>`
    )
    .join('')}
</urlset>`.trim()

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  })
}


