import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  try {
    // const post = await import(`../../../../lib/docs/${params.slug}.md`)
    const post = await import(`../../../lib/docs/${params.slug}.md`)

    return {
      content: post.default,
      meta: post.metadata
    }
  } catch (e: unknown) {
    console.error(e)
    throw error(404, `Could not find documentation for ${params.slug}`)
  }
}) satisfies PageLoad
