import { json, error, type RequestHandler } from '@sveltejs/kit'
import { docsMenu, AVAILABLE_VERSIONS, type DocVersion } from '$lib/config/docs'

export const prerender = true

// Indique à SvelteKit de pré-rendre une URL pour chaque version connue
export function entries() {
  return AVAILABLE_VERSIONS.map((v) => ({ v }))
}

interface SearchDoc {
  id: string
  title: string
  section: string
  slug: string
  url: string
  content: string
}

export const GET: RequestHandler = async ({ params }) => {
  const version = params.v as DocVersion

  if (!AVAILABLE_VERSIONS.includes(version)) {
    throw error(404, 'Version non trouvée')
  }

  const rawModules = import.meta.glob('/src/lib/docs/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
  }) as Record<string, string>

  const searchIndex: SearchDoc[] = []
  const menu = docsMenu[version]

  if (!menu) return json([])

  for (const section of menu) {
    for (const entry of section.entries) {
      const pages = entry.type === 'page' ? [entry] : entry.items

      for (const p of pages) {
        const moduleEntry = Object.entries(rawModules).find(([path]) => {
          return path.includes(`/src/lib/docs/${version}/`) && path.endsWith(`${p.slug.split('/').pop()}.md`)
        })

        let textContent = ''

        if (moduleEntry) {
          textContent = moduleEntry[1]
            .replace(/^---\n[\s\S]*?\n---\n/, '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/[#*`_~\[\]()|>-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        }

        searchIndex.push({
          id: `${version}-${p.slug}`,
          title: p.title,
          section: section.title,
          slug: p.slug,
          url: `/docs/${version}/${p.slug}`,
          content: textContent
        })
      }
    }
  }

  return json(searchIndex)
}

