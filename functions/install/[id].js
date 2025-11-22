import { fetchLatestRelease, fetchReleaseByTag, cleanTagName } from '../_utils.js'
import { CONFIG } from '../_config.js'

export async function onRequest(context) {
  const fullId = context.params.id
  const separatorIndex = fullId.lastIndexOf('@')

  if (separatorIndex === -1) return new Response(`Format invalide.`, { status: 400 })

  const toolName = fullId.substring(0, separatorIndex)
  const requestedVersion = fullId.substring(separatorIndex + 1)

  if (toolName !== CONFIG.toolName) return new Response(`Outil inconnu.`, { status: 404 })

  try {
    let targetRelease = null

    if (requestedVersion === 'latest') {
      targetRelease = await fetchLatestRelease(context.env)
    } else {
      targetRelease = await fetchReleaseByTag(context.env, `v${requestedVersion}`)

      if (!targetRelease) {
        targetRelease = await fetchReleaseByTag(context.env, requestedVersion)
      }
    }

    if (!targetRelease) {
      return new Response(`Version '${requestedVersion}' introuvable.`, { status: 404 })
    }

    const versionClean = cleanTagName(targetRelease.tag_name)
    const rawUrl = `${CONFIG.githubRaw}/${CONFIG.owner}/${CONFIG.repo}/main/.github/scripts/${CONFIG.scriptName}@${versionClean}`
    const scriptResponse = await fetch(rawUrl)

    if (!scriptResponse.ok) {
      return new Response(`Erreur 404: Script introuvable.\nURL: ${rawUrl}`, { status: 404 })
    }

    return new Response(await scriptResponse.text(), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  } catch (e) {
    return new Response(`Erreur serveur: ${e.message}`, { status: 500 })
  }
}

