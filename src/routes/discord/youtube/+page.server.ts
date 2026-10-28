import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  throw redirect(302, 'https://discord.gg/kbWyV9eRNx')
}) satisfies PageServerLoad
