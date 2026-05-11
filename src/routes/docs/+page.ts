import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { getFlatPages } from '../../lib/config/docs'

export const load = (async () => {
  const pages = getFlatPages()
  const first = pages[0]
  throw redirect(308, `/docs/${first.slug}`)
}) satisfies PageLoad
