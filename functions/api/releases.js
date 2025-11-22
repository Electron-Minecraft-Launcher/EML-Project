import { fetchReleases } from '../_utils.js'
import { CONFIG } from '../_config.js'

export async function onRequest(context) {
  try {
    const releasesRaw = await fetchReleases(context.env)

    const formatRelease = (r) => ({
      version: r.tag_name,
      published_at: r.published_at,
      is_prerelease: r.prerelease,
      installer_url: `https://${context.request.headers.get('host')}/install/${CONFIG.toolName}@${r.tag_name}`,
      assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url }))
    })

    const formatted = releasesRaw.map(formatRelease)

    const latestStable = releasesRaw.find((r) => !r.prerelease)
    if (latestStable) {
      const latestEntry = formatRelease(latestStable)
      latestEntry.version = 'latest'
      latestEntry.real_version = latestStable.tag_name
      formatted.unshift(latestEntry)
    }

    return new Response(JSON.stringify(formatted, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}

