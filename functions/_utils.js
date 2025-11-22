import { CONFIG } from './_config.js'

export async function fetchReleases(env) {
  const url = `${CONFIG.githubApi}/repos/${CONFIG.owner}/${CONFIG.repo}/releases`

  const cacheKey = new Request(url, { method: 'GET' })
  const cache = caches.default
  let response = await cache.match(cacheKey)

  if (!response) {
    console.log('Cache miss: Fetching from GitHub API')

    const headers = {
      'User-Agent': CONFIG.userAgent,
      Accept: 'application/vnd.github.v3+json'
    }

    if (env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`
    }

    response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`)
    }

    response = new Response(response.body, response)
    response.headers.set('Cache-Control', `max-age=${CONFIG.cacheTtl}`)

    await cache.put(cacheKey, response.clone())
  } else {
    console.log('Cache hit')
  }

  return await response.json()
}

export function findVersion(releases, requestedTag) {
  if (requestedTag === 'latest') {
    return releases.find((r) => !r.prerelease)
  }
  return releases.find((r) => r.tag_name === requestedTag)
}

