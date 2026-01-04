<script lang="ts">
  import type { PageData } from './$types'
  import { copyCode } from '$lib/utils/copycode'
  import { page } from '$app/state'
  import { title } from 'process'
  import SEO from '$lib/components/SEO.svelte'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let packageManager = $state<'curl' | 'wget'>('curl')
  let filterType = $state<'all' | 'stable' | 'pre-release'>('all')
  let searchQuery = $state('')

  let filteredVersions = $derived(
    data.versions.filter((v) => {
      const matchesSearch = v.version.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesType = true
      if (filterType === 'stable') matchesType = !v.isPreRelease
      if (filterType === 'pre-release') matchesType = v.isPreRelease

      return matchesSearch && matchesType
    })
  )

  function getInstallCommand(v: (typeof filteredVersions)[number]) {
    let atTag = v.isLatest ? '@latest' : `@${v.version}`
    switch (packageManager) {
      case 'curl':
        return `curl -fsSL https://${page.url.host}/install/admintool${atTag} | bash`
      case 'wget':
        return `wget -qO- https://${page.url.host}/install/admintool${atTag} | bash`
    }
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>

<SEO title="EML AdminTool packages — EML Project" description="Browse and install different versions of the EML AdminTool package." />

<section class="hero small">
  <div class="container-layout">
    <h1 class="hero-title"><span>EML AdminTool</span> packages</h1>
  </div>
</section>

<div class="container-layout">
  <div class="controls-bar">
    <div>
      <label for="" style="margin-bottom:  10px">Package manager</label>
      <div class="options">
        <label for="curl" class="inline"
          ><input bind:group={packageManager} type="radio" name="command" id="curl" value="curl" checked />&nbsp;&nbsp;cURL</label
        >
        <label for="wget" class="inline"
          ><input bind:group={packageManager} type="radio" name="command" id="wget" value="wget" />&nbsp;&nbsp;Wget</label
        >
      </div>
    </div>

    <div>
      <label for="channel-filter">Filter</label>
      <select bind:value={filterType} id="channel-filter">
        <option value="all">All</option>
        <option value="stable">Stable only</option>
        <option value="pre-release">Beta / Prerelease</option>
      </select>
    </div>

    <div>
      <label for="version-search">Search</label>
      <input bind:value={searchQuery} type="text" id="version-search" placeholder="v2.0.0..." style="margin-top: 0; width: 300px;" />
    </div>
  </div>

  <div class="versions-list" use:copyCode={[packageManager, filteredVersions]}>
    {#if filteredVersions.length === 0}
      <p class="empty-state">No versions match your search.</p>
    {/if}

    {#each filteredVersions as v (v.version)}
      <div class="version-card">
        <div class="card-header">
          <div class="title-row">
            <h2>
              {data.packageName} v{v.version}
            </h2>
            <div class="badges">
              {#if v.isLatest}
                <span class="badge latest">LATEST</span>
              {/if}
              {#if v.isPreRelease}
                <span class="badge pre-release">PRE-RELEASE</span>
              {/if}
            </div>
            <a
              href={`https://www.github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/tag/v${v.version}`}
              target="_blank"
              rel="noreferrer"
              class="github-link"
              title="View on GitHub"
            >
              <i class="fa-brands fa-github"></i>
            </a>
          </div>
          <div class="meta-row">
            <i class="fa-regular fa-calendar"></i> Published on {formatDate(v.date)}
          </div>
        </div>

        <div class="install-block">
          <pre>{getInstallCommand(v)}</pre>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .controls-bar {
    display: grid;
    grid-template-columns: 1fr auto auto;
    flex-wrap: wrap;
    gap: 20px;
    background: var(--bg-card, #fff);
    padding: 50px;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    margin-top: 50px;
    margin-bottom: 2rem;
    align-items: flex-end;

    .options {
      display: flex;
      gap: 15px;
    }

    div {
      width: auto;
    }

    label {
      margin-top: 0;
    }

    input[type='radio'] {
      display: inline-block !important;
      width: auto !important;
      outline: none !important;
      accent-color: var(--primary-color) !important;
      box-shadow: none !important;
    }
  }

  .versions-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .version-card {
    background: var(--bg-card, #fff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 50px;
    transition: box-shadow 0.2s ease;
  }

  .card-header {
    margin-bottom: 30px;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 8px;
    flex-wrap: wrap;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }

  .github-link {
    color: #555;
    font-size: 1.5rem;
    margin-left: auto;
    transition: all 0.2s;
    border: none;
  }

  .meta-row {
    color: var(--text-muted, #888);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badges {
    display: flex;
    gap: 10px;
  }

  .badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 50rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1;
  }

  .badge.latest {
    background-color: #e6f4ea;
    color: #1e7e34;
    border: 1px solid #c3e6cb;
  }

  .badge.pre-release {
    background-color: #fff8cd;
    color: #744807;
    border: 1px solid #f7daa4;
  }

  .install-block {
    background: #f3f4f6;
    border-radius: 5px;
    position: relative;

    pre {
      margin: 0;
      padding: 14px;
      font-family: 'Fira Code', monospace;
      font-size: 90%;
      line-height: 1.7;
      color: #24292e;
      overflow-x: auto;
    }
  }
</style>
