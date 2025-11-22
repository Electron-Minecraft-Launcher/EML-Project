import { fetchReleases, findVersion } from '../_utils.js'
import { CONFIG } from '../_config.js'

export async function onRequest(context) {
  const fullId = context.params.id

  const separatorIndex = fullId.lastIndexOf('@')
  if (separatorIndex === -1) {
    return new Response(`Invalid format. Use: /install/${CONFIG.toolName}@<version>`, { status: 400 })
  }

  const toolName = fullId.substring(0, separatorIndex)
  const requestedTag = fullId.substring(separatorIndex + 1)

  if (toolName !== CONFIG.toolName) {
    return new Response(`Unknown package.`, { status: 404 })
  }

  try {
    const releases = await fetchReleases(context.env)
    const targetRelease = findVersion(releases, requestedTag)

    if (!targetRelease) {
      return new Response(`Version '${requestedTag}' not found for ${toolName}.`, { status: 404 })
    }

    const realTag = targetRelease.tag_name
    const rawUrl = `${CONFIG.githubRaw}/${CONFIG.owner}/${CONFIG.repo}/main/.github/scripts/${CONFIG.scriptName}@${realTag}`

    console.log(`Request: ${requestedTag} -> Resolved to: ${realTag} -> URL: ${rawUrl}`)

    const scriptResponse = await fetch(rawUrl)

    if (!scriptResponse.ok) {
      return new Response(`Error: Installation script not found at expected location.\nURL: ${rawUrl}`, { status: 404 })
    }

    const scriptContent = await scriptResponse.text()

    return new Response(scriptContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
        // Optionnel: permet de le télécharger si on l'ouvre dans le navigateur
        // "Content-Disposition": `inline; filename="${CONFIG.scriptName}-${realTag}.sh"`
      }
    })
  } catch (e) {
    return new Response(`Erreur serveur: ${e.message}`, { status: 500 })
  }
}

