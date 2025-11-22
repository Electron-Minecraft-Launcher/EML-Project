import { CONFIG } from './_config.js'

async function fetchGitHub(env, endpoint) {
  const url = `${CONFIG.githubApi}/repos/${CONFIG.owner}/${CONFIG.repo}${endpoint}`

  const cacheKey = new Request(url, { method: 'GET' })
  const cache = caches.default
  let response = await cache.match(cacheKey)

  if (!response) {
    console.log(`Cache miss: ${url}`)
    const headers = {
      'User-Agent': CONFIG.userAgent,
      Accept: 'application/vnd.github.v3+json'
    }
    if (env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`
    }

    const apiRes = await fetch(url, { headers })

    if (apiRes.status === 404) {
      return null
    }

    if (!apiRes.ok) {
      throw new Error(`GitHub API Error ${apiRes.status} on ${endpoint}`)
    }

    response = new Response(apiRes.body, apiRes)
    response.headers.set('Cache-Control', `max-age=${CONFIG.cacheTtl}`)
    await cache.put(cacheKey, response.clone())
  }

  return await response.json()
}

export function cleanTagName(tag) {
  if (!tag) return ''
  return tag.replace(/^v/, '')
}

export async function fetchAllReleases(env) {
  const data = await fetchGitHub(env, '/releases')
  return data ?? []
}

export async function fetchLatestRelease(env) {
  let latest = await fetchGitHub(env, '/releases/latest')

  if (!latest) {
    console.log('GitHub /releases/latest is empty, fallback to the most recent one.')
    const all = await fetchAllReleases(env)
    if (all && all.length > 0) {
      latest = all[0]
    }
  }

  return latest
}

export async function fetchReleaseByTag(env, tag) {
  return await fetchGitHub(env, `/releases/tags/${tag}`)
}

