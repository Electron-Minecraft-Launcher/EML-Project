import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const modules = import.meta.glob('/src/lib/blog/*.md', { eager: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = Object.entries(modules).map(([path, module]: any) => {
    return {
      slug: path.split('/').pop()?.replace('.md', ''),
      meta: module.metadata,
      content: module.default
    }
  })

  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  })

  return {
    posts: sortedPosts
  }
}
