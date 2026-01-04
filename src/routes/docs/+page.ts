import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async () => {
  throw redirect(308, '/docs/required-knowledge')
}) satisfies PageLoad
