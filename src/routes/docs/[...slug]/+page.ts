import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { findFileBySlug } from '../../../lib/config/docs'

export const prerender = true

export const load = (async ({ params }) => {
  const filename = findFileBySlug(params.slug)

  if (!filename) {
    throw error(404, `Document ${params.slug} not found.`)
  }

  const modules = import.meta.glob('../../../lib/docs/**/*.md')
  const exactPath = `../../../lib/docs/${filename}.md`
  const match = modules[exactPath]

  if (!match) {
    throw error(404, `Document file for ${params.slug} not found.`)
  }

  try {
    const post = (await match()) as any

    return {
      content: post.default,
      meta: post.metadata,
      slug: params.slug
    }
  } catch (err) {
    console.error(err)
    throw error(404, `Document file for ${params.slug} not found.`)
  }
}) satisfies PageLoad
