import { DEFAULT_VERSION, type DocVersion } from '$lib/config/docs'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  throw redirect(307, `/docs/${DEFAULT_VERSION}`)
}) satisfies PageLoad

