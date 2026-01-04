import type { PageServerLoad } from './$types'

type Version = {
  version: string
  date: Date
  isLatest: boolean
  isPreRelease: boolean
}[]

export const load = (async ({ fetch }) => {
  const owner = 'Electron-Minecraft-Launcher'
  const repo = 'EML-AdminTool-v2'

  const headers = {
    'User-Agent': 'EML-Website',
    Accept: 'application/vnd.github.v3+json'
  }

  try {
    const [repoRes, releasesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, { headers })
    ])

    if (!releasesRes.ok) {
      throw new Error(`GitHub API error: ${releasesRes.status}`)
    }

    const repoData = repoRes.ok ? await repoRes.json() : {}
    const releasesData = await releasesRes.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const versions: Version = releasesData.map((release: any) => {
      const cleanVersion = release.tag_name.replace(/^v/, '')

      return {
        version: cleanVersion,
        date: new Date(release.published_at),
        isPreRelease: release.prerelease,
        isLatest: false,
        downloadUrl: release.html_url,
        assets: release.assets
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const latestStable = versions.find((v: any) => !v.isPreRelease)

    if (latestStable) {
      latestStable.isLatest = true
    } else if (versions.length > 0) {
      versions[0].isLatest = true
    }

    return {
      packageName: 'EML AdminTool',
      versions,
      description: repoData.description ?? 'Self-hosted backend tool for Electron Minecraft Launcher.',
      homepage: repoData.html_url ?? `https://github.com/${owner}/${repo}`
    }
  } catch (err) {
    console.error('Erreur chargement GitHub:', err)
    return {
      packageName: 'EML AdminTool',
      versions: [],
      description: 'Impossible de charger les versions depuis GitHub.',
      error: true
    }
  }
}) satisfies PageServerLoad
