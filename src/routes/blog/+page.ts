import type { PageLoad } from './$types'

export const prerender = true

export const load: PageLoad = async () => {
  const modules = import.meta.glob('/src/lib/blog/*.md', { eager: true })

  const posts = Object.entries(modules).map(([path, module]: any) => {
    return {
      slug: module.metadata?.slug || path.split('/').pop()?.replace('.md', ''),
      meta: module.metadata
    }
  })

  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  })

  return {
    posts: sortedPosts
  }
}

