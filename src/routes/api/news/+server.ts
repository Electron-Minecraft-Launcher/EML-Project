import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({url}) => {
  // get query param 'limit' if exists and 'content' if exists
  const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit') as string, 10) : null
  const getContent = url.searchParams.get('get-content') !== null

  const modules = import.meta.glob('/src/lib/blog/*.md', { eager: true })
  const rawModules = import.meta.glob('/src/lib/blog/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = Object.entries(modules).map(([path, file]: any) => {
    const slug = path.split('/').pop()?.replace('.md', '')
    const metadata = file.metadata
    const rawContent = rawModules[path] as string
    const content = rawContent.replace(/^---\n[\s\S]*?\n---\n/, '').trim()

    return {
      slug,
      ...metadata,
      content: getContent ? content : undefined
    }
  })

  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return json(sortedPosts.slice(0, limit ?? 10))
}

