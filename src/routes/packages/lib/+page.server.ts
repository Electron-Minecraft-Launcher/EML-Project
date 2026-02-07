import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ fetch }) => {
  const packageName = 'eml-lib'

  try {
    const res = await fetch(`https://registry.npmjs.org/${packageName}`)
    if (!res.ok) throw error(404, 'Package not found')

    const data = await res.json()

    const versions = Object.keys(data.time)
      .filter((v) => v !== 'created' && v !== 'modified' && data.versions[v] && !data.versions[v].deprecated)
      .map((version) => ({
        version,
        date: new Date(data.time[version]),
        isLatest: version === data['dist-tags'].latest,
        isPreRelease: version.includes('-alpha') || version.includes('-beta') || version.includes('-rc')
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    
    return {
      packageName: data.name,
      versions,
      description: data.description,
      homepage: data.homepage
    }
  } catch (err) {
    console.error(err)
    return {
      packageName,
      versions: [],
      error: 'Failed to fetch package data.'
    }
  }
}) satisfies PageServerLoad
