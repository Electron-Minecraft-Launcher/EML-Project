import { error } from '@sveltejs/kit'
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()
const VANILLA_VERSION_MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest.json'
const V = {
  forge: {
    name: 'Forge',
    mavenUrl: 'https://maven.minecraftforge.net',
    group: 'net.minecraftforge',
    artifact: 'forge',
    promotionsUrl: 'https://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions_slim.json'
  },
  neoforge: {
    name: 'NeoForge',
    mavenUrl: 'https://maven.neoforged.net/releases',
    group: 'net.neoforged',
    artifact: 'neoforge',
    promotionsUrl: null
  },
  fabric: {
    name: 'Fabric',
    metaUrl: 'https://meta.fabricmc.net',
    v2: true
  },
  quilt: {
    name: 'Quilt',
    metaUrl: 'https://meta.quiltmc.org',
    v2: false
  }
} as const

export interface LoaderVersion {
  majorVersion: string
  minecraftVersion: string
  loaderVersion: string
  type: ('release' | 'snapshot' | 'beta' | 'alpha' | 'latest' | 'recommended' | 'default')[]
}

export async function getVanillaVersions(): Promise<LoaderVersion[]> {
  const response = await fetchJson(VANILLA_VERSION_MANIFEST_URL, 'Failed to fetch Minecraft versions')

  let versions: LoaderVersion[] = [
    { majorVersion: 'Latest', minecraftVersion: 'latest_release', loaderVersion: 'latest_release', type: ['release'] },
    { majorVersion: 'Latest', minecraftVersion: 'latest_release', loaderVersion: 'latest_snapshot', type: ['snapshot'] }
  ]

  let majorVersion = 'Latest' // out of the loop to handle snapshots properly
  for (const version of response.versions) {
    if (version.id.includes('RV') || version.id.includes('3D')) continue

    majorVersion = getMajorVersion(version.id, majorVersion)
    const type = version.type.startsWith('old_') ? 'snapshot' : version.type
    versions.push({
      majorVersion: majorVersion,
      minecraftVersion: version.id,
      loaderVersion: version.id,
      type: type
    })
  }

  return versions
}

export async function getForgeLikeVersions(loader: 'forge' | 'neoforge'): Promise<LoaderVersion[]> {
  const cacheKey = loader === 'forge' ? 'forge-versions' : 'neoforge-versions'

  const v = V[loader]
  const mavenMetadataUrl = `${v.mavenUrl}/${v.group.replace(/\./g, '/')}/${v.artifact}/maven-metadata.xml`
  const metadata = await fetchXml(mavenMetadataUrl, `Failed to fetch ${v.name} versions`)
  const rawVersions: string[] = metadata?.metadata?.versioning?.versions?.version ?? []
  const promos: Record<string, string> | null = v.promotionsUrl
    ? (await fetchJson(v.promotionsUrl, `Failed to fetch ${v.name} promotions`)).promos
    : null

  const versions: LoaderVersion[] = []

  let majorVersion = 'Latest' // out of the loop to handle snapshots properly
  for (const version of rawVersions) {
    let minecraftVersion = ''
    let loaderVersion = version
    let forgeVersion = ''
    let type: LoaderVersion['type'] = ['default']

    if (v.name === 'Forge') {
      const parsed = parseForgeVersion(version, majorVersion)
      if (parsed) {
        minecraftVersion = parsed.minecraftVersion
        majorVersion = parsed.majorVersion
        forgeVersion = parsed.forgeVersion
      } else {
        continue
      }
    } else if (v.name === 'NeoForge') {
      const parsed = parseNeoForgeVersion(version, majorVersion)
      if (parsed) {
        minecraftVersion = parsed.minecraftVersion
        majorVersion = parsed.majorVersion
      } else {
        continue
      }
    }

    if (promos && promos[`${minecraftVersion}-recommended`] === forgeVersion) type.push('recommended')
    if (promos && promos[`${minecraftVersion}-latest`] === forgeVersion) type.push('latest')

    if (loaderVersion.toLowerCase().includes('beta')) type = ['beta']
    if (loaderVersion.toLowerCase().includes('alpha')) type = ['alpha']

    versions.push({ majorVersion, minecraftVersion, loaderVersion, type })
  }

  const sorted = versions.sort((a, b) => {
    const mcDiff = b.minecraftVersion.localeCompare(a.minecraftVersion, undefined, { numeric: true })
    if (mcDiff !== 0) return mcDiff
    return b.loaderVersion.localeCompare(a.loaderVersion, undefined, { numeric: true })
  })

  if (v.name === 'NeoForge') {
    const seenMcVersions = new Set<string>()

    for (const ver of sorted) {
      if (!seenMcVersions.has(ver.minecraftVersion)) {
        if (!ver.type.includes('latest')) {
          ver.type = ver.type.filter((t) => t !== 'default')
          ver.type.push('latest')
        }
        seenMcVersions.add(ver.minecraftVersion)
      }
    }
  }

  return sorted
}

export async function getFabricLikeGameVersions(loader: 'fabric' | 'quilt'): Promise<LoaderVersion[]> {
  const cacheKey = loader === 'fabric' ? 'fabric-game-versions' : 'quilt-game-versions'

  const v = V[loader]
  const gameVersionsUrl = `${v.metaUrl}/${v.v2 ? 'v2' : 'v3'}/versions/game`
  const rawGameVersions: { version: string; stable: boolean }[] = await fetchJson(gameVersionsUrl, `Failed to fetch ${v.name} game versions`)

  const gameVersions: LoaderVersion[] = []

  let majorVersion = 'Latest' // out of the loop to handle snapshots properly
  for (const gv of rawGameVersions) {
    if (gv.version.includes('3D')) continue
    majorVersion = getMajorVersion(gv.version, majorVersion)

    gameVersions.push({
      majorVersion: majorVersion,
      minecraftVersion: gv.version,
      loaderVersion: gv.version,
      type: [gv.stable ? 'release' : 'snapshot']
    })
  }

  return gameVersions
}

export async function getFabricLikeLoaderVersions(loader: 'fabric' | 'quilt'): Promise<string[]> {
  const cacheKey = loader === 'fabric' ? 'fabric-loader-versions' : 'quilt-loader-versions'

  const v = V[loader]
  const loaderVersionsUrl = `${v.metaUrl}/${v.v2 ? 'v2' : 'v3'}/versions/loader`
  const rawLoaderVersions = await fetchJson(loaderVersionsUrl, `Failed to fetch ${v.name} loader versions`)
  const loaderVersions: string[] = rawLoaderVersions.map((lv: any) => lv.version)

  return loaderVersions
}

function getMajorVersion(version: string, fallback = 'Latest'): string {
  const match = version.match(/^(1\.\d+)|^(\d+\.)/)
  let majorVersion = ''
  if (match) majorVersion = match[0].replace(/\.$/, '')
  if (majorVersion == '0') majorVersion = 'Classic'
  return majorVersion || fallback
}

function parseForgeVersion(v: string, currentMajor: string) {
  const parts = v.split('-')
  if (parts.length >= 2 && parts[0].startsWith('1.')) {
    const mcVer = parts[0]

    return {
      majorVersion: getMajorVersion(mcVer, currentMajor),
      minecraftVersion: mcVer,
      forgeVersion: parts[1]
    }
  }

  return null
}

function parseNeoForgeVersion(v: string, currentMajor: string) {
  try {
    if (/^\d{2,}\./.test(v) && !v.startsWith('1.')) {
      const cleanVer = v.split(/[-+]/)[0]
      const parts = cleanVer.split('.')

      const major = parseInt(parts[0])
      const minor = parseInt(parts[1]) || 0
      const patch = parseInt(parts[2]) || 0

      if (isNaN(major)) return null

      if (major >= 26) {
        let mcVer = `${major}.${minor}`
        if (patch > 0) mcVer += `.${patch}`

        const snapMatch = v.match(/snapshot[-.]?(\w+)/i)
        if (snapMatch) {
          mcVer += `-snapshot-${snapMatch[1]}`
        }

        return {
          majorVersion: getMajorVersion(mcVer, currentMajor),
          minecraftVersion: mcVer
        }
      }

      const mcVer = `1.${major}.${minor}`
      return {
        minecraftVersion: mcVer,
        majorVersion: getMajorVersion(mcVer, currentMajor)
      }
    }

    return null
  } catch {
    return null
  }
}

async function fetchJson(url: string, errorMsg: string): Promise<any> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`${errorMsg}:`, response.statusText)
      return error(500, `${errorMsg}: ${response.statusText}`)
    }
    return await response.json()
  } catch (err) {
    console.error(`${errorMsg}:`, err)
    return error(500, `${errorMsg}: ${err instanceof Error ? err.message : String(err)}`)
  }
}

async function fetchXml(url: string, errorMsg: string): Promise<any> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`${errorMsg}:`, response.statusText)
      return error(500, `${errorMsg}: ${response.statusText}`)
    }
    const text = await response.text()
    return parser.parse(text)
  } catch (err) {
    console.error(`${errorMsg}:`, err)
    return error(500, `${errorMsg}: ${err instanceof Error ? err.message : String(err)}`)
  }
}

