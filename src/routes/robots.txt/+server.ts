import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
  const robots = `User-Agent: *
Allow: /

Sitemap: https://emlproject.pages.dev/sitemap.xml`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
