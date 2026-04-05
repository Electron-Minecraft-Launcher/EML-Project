<script lang="ts">
  import { onMount } from 'svelte'
  import SEO from '$lib/components/SEO.svelte'
  import { type LoaderVersion } from '$lib/utils/versions-fetch'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  type LoaderType = 'vanilla' | 'forge' | 'neoforge' | 'fabric' | 'quilt'

  let loaderList: Record<LoaderType, LoaderVersion[]> = {
    vanilla: data.loaderList.vanilla,
    forge: data.loaderList.forge,
    neoforge: data.loaderList.neoforge,
    fabric: data.loaderList.fabric,
    quilt: data.loaderList.quilt
  }
  let fabricLoaderVersions: string[] = data.fabricLoaderVersions
  let quiltLoaderVersions: string[] = data.quiltLoaderVersions

  let loader: {
    type: LoaderType
    minecraftVersion?: string
    loaderVersion?: string
  } = $state({
    type: 'vanilla',
    minecraftVersion: undefined,
    loaderVersion: undefined
  })
  let majorVersion = $state(
    loader.minecraftVersion?.includes('latest') ? 'Latest' : (loader.minecraftVersion?.split('.').slice(0, 2).join('.') ?? '')
  )
  let minecraftVersions = $derived([...new Set(loaderList[loader.type]?.map((version) => version.majorVersion))])
  let selectedFabricVersion = $state(loader.type === 'fabric' && loader.loaderVersion ? loader.loaderVersion : (fabricLoaderVersions[0] ?? ''))
  let selectedQuiltVersion = $state(loader.type === 'quilt' && loader.loaderVersion ? loader.loaderVersion : (quiltLoaderVersions[0] ?? ''))
  let visibleVersions = $derived(loaderList[loader.type]?.filter((l) => l.majorVersion === majorVersion) || [])

  function switchMinecraftVersion(newVersion: string) {
    majorVersion = newVersion
    loader.loaderVersion = ''
  }

  function setVersion(selectedType: LoaderType, selectedVersion: LoaderVersion) {
    loader.type = selectedType
    loader.minecraftVersion = selectedVersion.minecraftVersion
    loader.loaderVersion =
      loader.type === 'fabric' ? selectedFabricVersion : loader.type === 'quilt' ? selectedQuiltVersion : selectedVersion.loaderVersion
  }

  function switchType(newType: LoaderType) {
    loader.type = newType
    loader.minecraftVersion = minecraftVersions[0]
    loader.loaderVersion = ''
  }

  function isActive(selectedVersion: LoaderVersion) {
    if (loader.type === 'fabric') {
      return selectedVersion.minecraftVersion === loader.minecraftVersion && loader.loaderVersion === selectedFabricVersion
    }
    if (loader.type === 'quilt') {
      return selectedVersion.minecraftVersion === loader.minecraftVersion && loader.loaderVersion === selectedQuiltVersion
    }
    return selectedVersion.loaderVersion === loader.loaderVersion
  }

  function isValid(selectedLoader: typeof loader): boolean {
    if (loader.type === 'fabric') {
      return selectedLoader.minecraftVersion === loader.minecraftVersion && selectedFabricVersion === loader.loaderVersion
    }
    if (loader.type === 'quilt') {
      return selectedLoader.minecraftVersion === loader.minecraftVersion && selectedQuiltVersion === loader.loaderVersion
    }
    return !!(selectedLoader.loaderVersion) && selectedLoader.loaderVersion === loader.loaderVersion
  }

  function formatVersionName(version: LoaderVersion): string {
    const mcVer = version.minecraftVersion
    if (loader.type === 'forge') {
      const forgeVer = version.loaderVersion.split('-').slice(1).join('-')
      return `Minecraft ${mcVer} (Forge ${forgeVer})`
    }
    if (loader.type === 'neoforge') {
      const neoForgeVer = version.loaderVersion
      return `Minecraft ${mcVer} (NeoForge ${neoForgeVer})`
    }
    if (loader.type === 'fabric') {
      return `Minecraft ${mcVer} (Fabric ${selectedFabricVersion})`
    }
    if (loader.type === 'quilt') {
      return `Minecraft ${mcVer} (Quilt ${selectedQuiltVersion})`
    }
    if (version.loaderVersion === 'latest_release') return 'Latest Minecraft release'
    if (version.loaderVersion === 'latest_snapshot') return 'Latest Minecraft snapshot'
    return `Minecraft ${version.loaderVersion}`
  }

  function getGroupedVersions(type: LoaderType, versions: LoaderVersion[]) {
    const groups: { label: string; versions: LoaderVersion[] }[] = []

    if (type === 'vanilla' || type === 'fabric' || type === 'quilt') {
      const releases = versions.filter((v) => v.type.includes('release'))
      if (releases.length) groups.push({ label: 'Releases', versions: releases })

      const snapshots = versions.filter((v) => v.type.includes('snapshot'))
      if (snapshots.length) groups.push({ label: 'Snapshots', versions: snapshots })
    } else if (type === 'forge') {
      const recommended = versions.filter((v) => v.type.includes('recommended'))
      if (recommended.length) groups.push({ label: 'Recommended', versions: recommended })

      const latest = versions.filter((v) => v.type.includes('latest'))
      if (latest.length) groups.push({ label: 'Latest', versions: latest })

      if (versions.length) groups.push({ label: 'All versions', versions })
    } else if (type === 'neoforge') {
      const latest = versions.filter((v) => v.type.includes('latest'))
      if (latest.length) groups.push({ label: 'Latest', versions: latest })

      const stable = versions.filter((v) => !v.type.includes('beta') && !v.type.includes('alpha'))
      if (stable.length) groups.push({ label: 'Stable', versions: stable })

      const ba = versions.filter((v) => v.type.includes('beta') || v.type.includes('alpha'))
      if (ba.length) groups.push({ label: 'Beta & Alpha', versions: ba })
    }

    return groups
  }

  function isOldFabricVersion(version: string) {
    const [maj, min, pat] = version.split('.').map((v) => parseInt(v))
    return maj <= 0 && min < 15
  }

  function formatH4Title(type: LoaderType, majorVersion: string) {
    if (loader.type === 'forge') {
      return `Minecraft Forge ${majorVersion === 'Latest' || majorVersion === 'Snapshots' ? majorVersion : `${majorVersion}.x`}`
    }
    if (loader.type === 'fabric') {
      return `Minecraft Fabric ${majorVersion === 'Latest' || majorVersion === 'Snapshots' ? majorVersion : `${majorVersion}.x`}`
    }
    if (loader.type === 'neoforge') {
      return `Minecraft NeoForge ${majorVersion === 'Latest' || majorVersion === 'Snapshots' ? majorVersion : `${majorVersion}.x`}`
    }
    if (loader.type === 'quilt') {
      return `Minecraft Quilt ${majorVersion === 'Latest' || majorVersion === 'Snapshots' ? majorVersion : `${majorVersion}.x`}`
    }
    return `Minecraft Vanilla ${majorVersion === 'Latest' || majorVersion === 'Snapshots' ? majorVersion : `${majorVersion}.x`}`
  }
</script>

<SEO title="Minecraft versions — EML Project" description="Find the Minecraft versions and loader versions for your game." />

<section class="hero small">
  <div class="container-layout">
    <h1 class="hero-title">Minecraft versions</h1>
  </div>
</section>

<div class="container-layout">
  <div class="list-container">
    <h3>Select a mod loader and a Minecraft version</h3>
    <div class="list-content">
      <div class="list loader-list">
        <p class="label sticky-header">Loaders</p>
        <button class="list" type="button" class:active={loader.type === 'vanilla'} onclick={() => switchType('vanilla')}> Vanilla </button>
        <button class="list" type="button" class:active={loader.type === 'forge'} onclick={() => switchType('forge')}>Forge</button>
        <button class="list" type="button" class:active={loader.type === 'neoforge'} onclick={() => switchType('neoforge')}> NeoForge </button>
        <button class="list" type="button" class:active={loader.type === 'fabric'} onclick={() => switchType('fabric')}>Fabric</button>
        <button class="list" type="button" class:active={loader.type === 'quilt'} onclick={() => switchType('quilt')}>Quilt</button>
      </div>

      <div class="list version-list">
        {#if loader.type === 'fabric'}
          <label for="loader-version" class="sticky-header" style="z-index: 100">Loader version</label>
          <select name="loader-version" id="loader-version" class="loader-list-select" bind:value={selectedFabricVersion}>
            {#each fabricLoaderVersions as version}
              <option
                value={version}
                title={isOldFabricVersion(version) ? 'Old Fabric Loader version may not support recent Minecraft versions.' : ''}
                class:old={isOldFabricVersion(version)}>{version}</option
              >
            {/each}
          </select>
        {:else if loader.type === 'quilt'}
          <label for="loader-version" class="sticky-header" style="z-index: 100">Loader version</label>
          <select name="loader-version" id="loader-version" class="loader-list-select" bind:value={selectedQuiltVersion}>
            {#each quiltLoaderVersions as version}
              <option value={version}>{version}</option>
            {/each}
          </select>
        {/if}
        <p class="label sticky-header" style="z-index: 100">Minecraft versions</p>
        {#each minecraftVersions as version}
          <button class="list" type="button" class:active={majorVersion === version} onclick={() => switchMinecraftVersion(version)}>
            {version}
          </button>
        {/each}
      </div>

      <div class="list content-list">
        <h4>{formatH4Title(loader.type, majorVersion)}</h4>

        {#each getGroupedVersions(loader.type, visibleVersions) as group}
          <p class="label">{group.label}</p>
          {#each group.versions as version}
            <button type="button" class:active={isActive(version)} onclick={() => setVersion(loader.type, version)}>
              {formatVersionName(version)}
              {#if version.loaderVersion === 'latest_release' || version.loaderVersion === 'latest_snapshot'}
                &nbsp;&nbsp;<i class="fa-solid fa-circle-question" style="cursor: help"></i>
              {/if}
            </button>
          {:else}
            <p class="no-link">-</p>
          {/each}
        {:else}
          <p class="no-link">-</p>
        {/each}
      </div>
      <div class="list content-list" style="flex: 0.6 !important; border-left: 1px solid var(--border-color, #e5e7eb); padding-left: 30px;">
        <h4>Version details</h4>
        {#if loader.minecraftVersion && isValid(loader)}
          <p>You can use these information to <a href="/resources/config-generator">configure EML Lib</a>.</p>

          <p class="label">Minecraft version</p>
          <p style="margin-top: 0;">{loader.minecraftVersion}</p>

          <p class="label">Loader type</p>
          <p style="margin-top: 0;">
            {loader.type === 'vanilla'
              ? 'Vanilla'
              : loader.type === 'forge'
                ? 'Forge'
                : loader.type === 'neoforge'
                  ? 'NeoForge'
                  : loader.type === 'fabric'
                    ? 'Fabric'
                    : 'Quilt'}
          </p>

          {#if loader.loaderVersion && loader.type !== 'vanilla'}
            <p class="label">Loader version</p>
            <p style="margin-top: 0;">{loader.loaderVersion}</p>
          {/if}
        {:else}
          <p class="no-link">Select a version to see details.</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  div.list-container {
    margin-top: 50px;
    background: var(--bg-card, #fff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 50px;
    transition: box-shadow 0.2s ease;

    h3 {
      margin-top: 0;
      margin-bottom: 30px;
    }

    div.list-content {
      display: flex;
      flex-wrap: nowrap;
      gap: 0 50px;
    }

    div.list {
      display: block;
      flex: 1;
      width: 175px;
      overflow-x: hidden;
      min-height: 400px;
      max-height: 600px;
      overflow-y: auto;

      &.small {
        min-height: 200px;
        max-height: 300px;
      }

      button.list {
        overflow-x: hidden;
        background: none;
        display: block;
        width: 175px;
        text-align: left;
        margin-top: 5px;

        &.active {
          background: #f5f5f5;
        }

        &:hover {
          background: #eeeeee;
        }
      }
    }

    div.content-list {
      flex: calc(100% - 400px);
      position: relative;
    }
  }

  p.sticky-header,
  label.sticky-header {
    margin-top: 0;
    position: sticky;
    top: 0;
    background: white;
  }

  div.list {
    min-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    max-height: calc(100vh - 175px - 30px - 35px - 71px) !important;
    overflow-y: auto;

    &.loader-list {
      flex: unset !important;
      width: 140px !important;
    }

    &.version-list {
      flex: 0.35 !important;

      select.loader-list-select {
        display: block;
        width: 100%;
        margin-bottom: 20px;

        option.old {
          color: #912020;
        }
      }
    }

    &.content-list {
      flex: 1 !important;

      h4 {
        margin-top: 0;
        position: sticky;
        top: 0;
        background: white;
        z-index: 100;
      }
    }

    button:not(.remove):not(.upload) {
      display: block;
      border-bottom: none;
      color: #1e1e1e;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: 'Poppins';
      background: none;
      width: 100% !important;
      line-height: 15px;
      text-align: left;

      i {
        color: #1e1e1e;
      }

      &.active {
        background: #f5f5f5;
      }

      &:hover {
        background: #eeeeee;
      }
    }
  }

  code {
    background: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
  }

  button.secondary.upload {
    margin-top: 0;
  }
</style>
