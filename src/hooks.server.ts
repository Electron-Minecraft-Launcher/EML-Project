import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const host = event.url.hostname

  if (host === 'emlproject.pages.dev' || host === 'www.emlproject.com') {
    const newUrl = new URL(event.url)
    newUrl.hostname = 'emlproject.com'

    throw redirect(301, newUrl.toString())
  }

  return resolve(event)
}
