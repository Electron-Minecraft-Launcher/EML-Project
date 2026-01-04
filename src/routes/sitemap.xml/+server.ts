import { docsMenu } from '$lib/config/docs'
import type { RequestHandler } from './$types'

const site = 'https://emlproject.pages.dev'

export const GET: RequestHandler = async () => {
  const pages = ['', '/packages', '/packages/lib', '/packages/admintool']
  const docPages = docsMenu.flatMap((section) => section.items.map((item) => `/docs/${item.slug}`))

  const allPages = [...pages, ...docPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  ${allPages
    .map(
      (page) => `
  <url>
    <loc>${site}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? 1.0 : 0.8}</priority>
  </url>
  `
    )
    .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  })
}
