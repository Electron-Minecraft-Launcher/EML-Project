<script lang="ts">
  import { modpackStore, generatedModpack } from '$lib/stores/modpack-json-generator'
  import { calculateSHA1 } from '$lib/utils/crypto'
  import { fade, scale } from 'svelte/transition'
  import { backOut } from 'svelte/easing'
  import hljs from 'highlight.js'
  import json from 'highlight.js/lib/languages/json'
  import SEO from '$lib/components/SEO.svelte'
  import confetti from 'canvas-confetti'

  hljs.registerLanguage('json', json)

  let isFinished = $state(false)
  let filesInput: HTMLInputElement
  let webFiles: File[] = $state([])

  async function handleFolderSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files) return
    webFiles = Array.from(input.files)
    console.log(webFiles)
  }

  $inspect(webFiles)

  async function processFiles() {
    modpackStore.update((s) => ({ ...s, isProcessing: true, files: [] }))
    const processedFiles: any[] = []
    const folders = new Set<string>()

    for (const file of webFiles) {
      const fullPath = file.webkitRelativePath
      const pathParts = fullPath.split('/')
      pathParts.shift()

      const fileName = pathParts.pop() || ''
      if (!fileName || fileName === '.DS_Store') continue

      const relativeDir = pathParts.join('/') + (pathParts.length > 0 ? '/' : '')

      pathParts.forEach((part) => {
        folders.add(part)
      })

      const sha1 = await calculateSHA1(file)
      const type = relativeDir.startsWith('mods/') ? 'MOD' : 'OTHER'

      processedFiles.push({
        name: fileName,
        path: relativeDir,
        size: file.size,
        sha1: sha1,
        url: `${$modpackStore.baseUrl}/${relativeDir}${fileName}`,
        type: type
      })
    }

    const folderEntries = Array.from(folders).map((f) => ({
      name: f,
      path: '',
      url: `${$modpackStore.baseUrl}/${f}`,
      type: 'FOLDER'
    }))

    modpackStore.update((s) => ({
      ...s,
      isProcessing: false,
      files: [...folderEntries, ...processedFiles]
    }))

    copyAndFinish()
  }

  function copyAndFinish() {
    navigator.clipboard.writeText(JSON.stringify($generatedModpack))
    isFinished = true
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
  }

  function startOver() {
    webFiles = []
    modpackStore.set({
      baseUrl: '',
      files: [],
      isProcessing: false
    })
    isFinished = false
  }

  function clearFiles() {
    webFiles = []
    filesInput.value = ''
  }
</script>

<SEO title="Modpack JSON Generator — EML Project" description="Generate your modpack manifest locally." />

<section class="hero small">
  <div class="container-layout">
    <h1 class="hero-title">Modpack JSON generator</h1>
  </div>
</section>

<section class="container-layout">
  <div class="container">
    {#if !isFinished}
      <div class="generator-grid" in:fade>
        <div class="form-card">
          <h3>Select your modpack folder</h3>
          <p class="info">
            Everything is calculated locally: no data is sent to any server.<br />
            We suggest using the following folder structure:
          </p>
          <pre>/ (modpack folder)
├─ mods/
│  ├─ mod1.jar
│  └─ mod2.jar
├── config/
│  ├─ mod1.toml
│  └─ mod2.toml
├─ resourcepacks/
│  ├─ pack1.zip
│  └─ pack2.zip
├─ options.txt
└─ server.dat</pre>

          <div class="input-field" style="margin-top: 2rem;">
            <label for="base-url">Base URL (where your files will be hosted)</label>
            <input id="base-url" type="text" bind:value={$modpackStore.baseUrl} placeholder="https://your-site.fr/launcher" />
          </div>

          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="drop-zone" onclick={() => filesInput.click()} class:complete={webFiles.length > 0}>
            {#if webFiles.length === 0}
              <i class="fa-solid fa-folder-open"></i>
              <p class="info">Click to select a folder...</p>
              <input type="file" bind:this={filesInput} webkitdirectory onchange={handleFolderSelect} style="display: none;" />
            {:else}
              <p class="info">{webFiles.length} file{webFiles.length > 1 ? 's' : ''} selected</p>
              <button class="delete" onclick={clearFiles}>Clear</button>
            {/if}
          </div>

          <button
            class="button primary"
            style="width: 100%;"
            onclick={processFiles}
            disabled={$modpackStore.isProcessing || webFiles.length === 0 || !$modpackStore.baseUrl}
          >
            {$modpackStore.isProcessing ? 'Generating JSON...' : 'Generate and copy JSON'}
          </button>
        </div>

        <div class="preview-card">
          <div class="code-block">
            <div class="code-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="filename">modpack.json</span>
            </div>
            <pre><code>{@html hljs.highlight(JSON.stringify({ files: [] }, null, 2), { language: 'json' }).value}</code></pre>
          </div>
        </div>
      </div>
    {:else}
      <div class="finished-view" in:scale={{ start: 0.9, duration: 300, easing: backOut }} style="position: relative;">
        <button class="a" onclick={startOver} style="position: absolute; top: 0; left: 0;">
          <i class="fa-solid fa-arrow-left"></i> Start over
        </button>
        <div class="success-message">
          <i class="fa-solid fa-circle-check"></i>
          <h2>JSON generated!</h2>
          <p>The code has been copied to your clipboard.</p>
        </div>

        <div class="code-block large">
          <div class="code-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="filename">modpack.json</span>
            <span class="status-badge">Copied!</span>
          </div>
          <pre><code>{@html hljs.highlight(JSON.stringify($generatedModpack, null, 2), { language: 'json' }).value}</code></pre>
        </div>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @use 'sass:meta';

  .container {
    padding: 4rem 0;

    .generator-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 2rem;
      align-items: start;

      h3 {
        margin-top: 0;
        margin-bottom: 0px;
      }
    }

    .form-card,
    .preview-card {
      padding: 2rem;
      border-radius: 12px;
    }

    .preview-card {
      padding-top: 0;
    }

    div.form-card {
      background: white;
      border: 1px solid var(--border-color);

      pre {
        background: #f5f5f5;
        color: #333;
        padding: 0.6rem 0.8rem;
        border-radius: 8px;
        overflow-x: auto;
        font-family: 'Fira Code', monospace !important;
        font-size: 0.85rem;
      }
    }

    p.info,
    ul.info {
      margin-top: 20px;
      margin-bottom: 0px;
      position: relative;
      color: #333;
      font-size: 0.85rem;

      code {
        background: #f5f5f5;
        padding: 0.1rem 0.2rem;
        border-radius: 4px;
        font-family: 'Fira Code', monospace !important;
        font-size: 0.85rem;
      }
    }

    p.info + ul.info {
      margin-top: 5px;
    }

    .options {
      display: flex;
      gap: 1rem;
      margin-top: 30px;

      button {
        flex: 1;
        padding: 1rem;
        background: transparent;
        border: 2px solid var(--border-color);
        cursor: pointer;
        transition: 0.2s;

        &.selected {
          border-color: var(--primary-color);
          background: rgba(var(--primary-rgb), 0.1);
        }
      }
    }

    .list-manager {
      div.flex {
        display: flex;
        gap: 0.5rem;

        input {
          flex: 1;
          margin-top: 0;
        }

        button {
          height: 41px;
        }
      }
    }

    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;

      .tag {
        background: rgba(var(--primary-rgb), 0.1);
        border: 1px solid var(--border-color);
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;

        .delete {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 0;
        }
      }
    }

    .actions {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;

      button.primary,
      button.secondary {
        width: 200px;
        margin-top: 0;
      }
    }
  }

  .drop-zone {
    border: 2px dashed var(--border-color);
    text-align: center;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    height: 100px;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    flex-direction: column;
    transition: 0.2s;
    margin: 2rem 0;

    &.complete {
      border: 2px solid var(--border-color);
      cursor: default;
      
      &:hover {
        border: 2px solid var(--border-color);
      }
    }

    &:hover {
      border-color: var(--primary-color);
    }

    i {
      display: block;
      font-size: 1.8rem;
      color: #777;
      margin-bottom: 10px;
    }

    p.info {
      margin: 0;
    }

    button.delete {
      background: transparent;
      border: none;
      color: #888;
      cursor: pointer;
      padding: 0.5rem 0.7rem;
      border-radius: 4px;
      font-size: 0.85rem;
      margin-top: 10px;

      &:hover {
        background: rgba(255, 0, 0, 0.1);
        color: #ff4d4d;
      }
    }
  }

  .stats {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .code-block {
    flex: 1;
    background: #1e1e1e;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    color: #d4d4d4;
    font-size: 0.9rem;
    width: 400px !important;

    :global {
      @include meta.load-css('../../../../static/styles/home-theme.scss');
    }

    .code-header {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      align-items: center;
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .red {
        background: #ff5f56;
      }
      .yellow {
        background: #ffbd2e;
      }
      .green {
        background: #27c93f;
      }
      .filename {
        margin-left: auto;
        color: #888;
        font-size: 0.8rem;
      }
    }

    pre {
      margin: 0;
      overflow-x: auto;
    }

    code,
    code > span * {
      font-family: 'Fira Code', monospace !important;
    }

    .keyword {
      color: #569cd6;
    }
    .string {
      color: #ce9178;
    }
    .comment {
      color: #6a9955;
    }
  }

  .finished-view {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;

    .success-message {
      margin-bottom: 2rem;
      i {
        color: #19a22e;
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      h2 {
        color: #333;
        margin-bottom: 0.5rem;
      }
      p {
        color: #666;
      }
    }

    .code-block.large {
      display: block;
      width: auto !important;
      text-align: left;
      transition: transform 0.3s ease;

      .status-badge {
        margin-left: 1rem;
        background: rgba(39, 201, 63, 0.2);
        color: #27c93f;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  }
</style>
