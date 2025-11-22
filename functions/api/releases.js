import { fetchAllReleases, fetchLatestRelease, cleanTagName } from '../_utils.js'
import { CONFIG } from '../_config.js'

export async function onRequest(context) {
  try {
    const [allReleases, latestRelease] = await Promise.all([fetchAllReleases(context.env), fetchLatestRelease(context.env)])

    const host = context.request.headers.get('host')

    const formatRelease = (r, isVirtualLatest = false) => {
      const versionClean = cleanTagName(r.tag_name)
      return {
        version: isVirtualLatest ? 'latest' : versionClean,
        published_at: r.published_at,
        is_prerelease: r.prerelease,
        installer_url: `https://${host}/install/${CONFIG.toolName}@${isVirtualLatest ? 'latest' : versionClean}`,
        real_version: versionClean,
        assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url }))
      }
    }

    const formattedList = allReleases.map((r) => formatRelease(r, false))

    if (latestRelease) {
      const latestEntry = formatRelease(latestRelease, true)
      formattedList.unshift(latestEntry)
    }

    return new Response(JSON.stringify(formattedList, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}

