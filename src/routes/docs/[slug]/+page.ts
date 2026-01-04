import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import  {docsMenu} from '../../../lib/config/docs'

export const load = (async ({ params }) => {
  try {
    const filename = docsMenu.flatMap(section => section.items)
      .find(item => item.slug === params.slug)?.file
    const post = await import(`../../../lib/docs/${filename}.md`)

    return {
      content: post.default,
      meta: post.metadata,
      slug: params.slug
    }
  } catch (e) {
    console.error(e)
    throw error(404, `Document ${params.slug} not found.`)
  }
}) satisfies PageLoad
