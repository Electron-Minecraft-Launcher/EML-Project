import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob('/src/lib/blog/*.md', { eager: true })

  for (const [path, module] of Object.entries(modules)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moduleData = module as any
    const postSlug = moduleData.metadata?.slug || path.split('/').pop()?.replace('.md', '')

    if (postSlug === params.slug) {
      return {
        meta: moduleData.metadata,
        content: moduleData.default
      }
    }
  }

  error(404, 'Post not found')
}
