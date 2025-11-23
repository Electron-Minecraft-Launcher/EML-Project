import { fetchAllReleases, fetchLatestRelease, cleanTagName } from '../_utils.js'
import { CONFIG } from '../_config.js'

export async function onRequest(context) {
  try {
    const [allReleases, latestRelease] = await Promise.all([fetchAllReleases(context.env), fetchLatestRelease(context.env)])

    const host = context.request.headers.get('host')
    const baseInstallUrl = `https://${host}/install/${CONFIG.toolName}`

    const latestId = latestRelease ? latestRelease.id : null

    const formattedList = allReleases.map((r) => {
      const versionClean = cleanTagName(r.tag_name)
      const isLatest = latestId && r.id === latestId
      const installerUrls = []

      installerUrls.push(`${baseInstallUrl}@${versionClean}`)

      if (isLatest) {
        installerUrls.push(`${baseInstallUrl}@latest`)
      }

      return {
        version: versionClean,
        published_at: r.published_at,
        is_prerelease: r.prerelease,
        is_latest: isLatest,
        installer_urls: installerUrls,
        assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url }))
      }
    })

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
