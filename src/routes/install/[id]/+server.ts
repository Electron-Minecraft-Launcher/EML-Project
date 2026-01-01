import { type RequestHandler } from '@sveltejs/kit'

const CONFIG = {
  owner: 'Electron-Minecraft-Launcher',
  repo: 'eml-admintool-v2',
  toolName: 'admintool',
  scriptName: 'eml-admintool',
  githubRaw: 'https://raw.githubusercontent.com',
  githubApi: 'https://api.github.com'
}

function cleanTagName(tag: string): string {
  return tag.startsWith('v') ? tag.substring(1) : tag
}

async function fetchLatestRelease(fetcher: typeof fetch) {
  const url = `${CONFIG.githubApi}/repos/${CONFIG.owner}/${CONFIG.repo}/releases/latest`
  const res = await fetcher(url, {
    headers: { 'User-Agent': 'EML-Installer' }
  })
  if (!res.ok) return null
  return await res.json()
}

async function fetchReleaseByTag(fetcher: typeof fetch, tag: string) {
  const url = `${CONFIG.githubApi}/repos/${CONFIG.owner}/${CONFIG.repo}/releases/tags/${tag}`
  const res = await fetcher(url, {
    headers: { 'User-Agent': 'EML-Installer' }
  })
  if (!res.ok) return null
  return await res.json()
}

export const GET: RequestHandler = async ({ params, fetch }) => {
  const fullId = params.id ?? ''
  const separatorIndex = fullId.lastIndexOf('@')

  if (separatorIndex === -1) {
    return new Response(`Invalid format. Expected: tool@version`, { status: 400 })
  }

  const toolName = fullId.substring(0, separatorIndex)
  const requestedVersion = fullId.substring(separatorIndex + 1)

  if (toolName !== CONFIG.toolName) {
    return new Response(`Unknown tool: '${toolName}'. Only '${CONFIG.toolName}' is supported.`, {
      status: 404
    })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetRelease: any = null

    if (requestedVersion === 'latest') {
      targetRelease = await fetchLatestRelease(fetch)
    } else {
      targetRelease = await fetchReleaseByTag(fetch, `v${requestedVersion}`)

      if (!targetRelease) {
        targetRelease = await fetchReleaseByTag(fetch, requestedVersion)
      }
    }

    if (!targetRelease) {
      return new Response(`Version '${requestedVersion}' not found on GitHub.`, { status: 404 })
    }

    const versionClean = cleanTagName(targetRelease.tag_name)
    const rawUrl = `${CONFIG.githubRaw}/${CONFIG.owner}/${CONFIG.repo}/main/.github/scripts/${CONFIG.scriptName}@${versionClean}`
    const scriptResponse = await fetch(rawUrl)

    if (!scriptResponse.ok) {
      return new Response(`Error 404: Installation script not found.\nTried URL: ${rawUrl}`, {
        status: 404
      })
    }

    const scriptContent = await scriptResponse.text()

    return new Response(scriptContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (err: unknown) {
    console.error(err)
    return new Response(`Server error: ${err instanceof Error ? err.message : 'unknown error'}`, { status: 500 })
  }
}
