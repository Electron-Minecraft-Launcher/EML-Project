import { error, redirect } from '@sveltejs/kit'
import type { EntryGenerator, PageLoad } from './$types'
import { findFileBySlug, DEFAULT_VERSION, AVAILABLE_VERSIONS, type DocVersion, getFlatPages } from '$lib/config/docs'

export const prerender = true

export const entries: EntryGenerator = () => {
  const allEntries: { slug: string }[] = []

  for (const v of AVAILABLE_VERSIONS) {
    allEntries.push({ slug: v })

    const pages = getFlatPages(v)
    for (const page of pages) {
      allEntries.push({ slug: `${v}/${page.slug}` })
    }
  }

  return allEntries
}

export const load: PageLoad = async ({ params }) => {
  const parts = params.slug ? params.slug.split('/').filter(Boolean) : []
  console.log(parts)

  let version: DocVersion = DEFAULT_VERSION
  let pageSlug = ''

  if (parts.length > 0 && AVAILABLE_VERSIONS.includes(parts[0] as DocVersion)) {
    version = parts[0] as DocVersion
    pageSlug = parts.slice(1).join('/')
  } else {
    throw redirect(307, `/docs/${DEFAULT_VERSION}${params.slug ? '/' + params.slug : ''}`)
  }

  const filename = findFileBySlug(pageSlug, version)
  if (!filename) {
    throw error(404, `Document "${params.slug}" not found.`)
  }

  const modules = import.meta.glob('../../../lib/docs/**/*.md')
  const exactPath = `../../../lib/docs/${version}/${filename}.md`
  const match = modules[exactPath]

  if (!match) {
    throw error(404, `Document file for "${params.slug}" not found.`)
  }

  try {
    const post = (await match()) as any
    return {
      content: post.default,
      meta: post.metadata,
      slug: pageSlug,
      version
    }
  } catch (err) {
    console.error(err)
    throw error(404, `Document file for "${params.slug}" not found.`)
  }
}


