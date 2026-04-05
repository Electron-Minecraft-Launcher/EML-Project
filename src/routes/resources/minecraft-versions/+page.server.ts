import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getVanillaVersions, getForgeLikeVersions, getFabricLikeGameVersions, getFabricLikeLoaderVersions } from '$lib/utils/versions-fetch'

export const load = (async () => {
  try {
    const [vanilla, forge, neoforge, fabric, quilt, fabricV, quiltV] = await Promise.all([
      getVanillaVersions(),
      getForgeLikeVersions('forge'),
      getForgeLikeVersions('neoforge'),
      getFabricLikeGameVersions('fabric'),
      getFabricLikeGameVersions('quilt'),
      getFabricLikeLoaderVersions('fabric'),
      getFabricLikeLoaderVersions('quilt')
    ])

    const loaderList = {
      vanilla,
      forge,
      neoforge,
      fabric,
      quilt
    }

    const fabricLoaderVersions = fabricV
    const quiltLoaderVersions = quiltV

    return { loaderList, fabricLoaderVersions, quiltLoaderVersions }
  } catch (err) {
    console.error('Failed to load Minecraft versions page:', err)
    return error(500, 'Failed to load Minecraft versions page')
  }
}) satisfies PageServerLoad

