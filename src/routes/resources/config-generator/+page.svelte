<script lang="ts">
  import { generatorStore, generatedConfig } from '$lib/stores/config-generator'
  import { fade, scale } from 'svelte/transition'
  import hljs from 'highlight.js'
  import typescript from 'highlight.js/lib/languages/typescript'
  import SEO from '$lib/components/SEO.svelte'
  import confetti from 'canvas-confetti'
  import { backOut } from 'svelte/easing'

  hljs.registerLanguage('typescript', typescript)

  const steps = [
    { id: 1, title: 'Source' },
    { id: 2, title: 'Profiles' },
    { id: 3, title: 'Technical' },
    { id: 4, title: 'Storage' },
    { id: 5, title: 'Maintenance' },
    { id: 6, title: 'Java' },
    { id: 7, title: 'Game & JVM args' }
  ]

  let configJson = $state('')
  let isFinished = $state(false)

  let disabled = $derived.by(() => {
    if ($generatorStore.step === 1) {
      return $generatorStore.useAdminTool && $generatorStore.url?.length < 5
    }
    if ($generatorStore.step === 2) {
      return $generatorStore.useProfiles && !$generatorStore.slug && !$generatorStore.useAdminTool
    }
    if ($generatorStore.step === 3) {
      if ($generatorStore.useAdminTool) return false
      if (!$generatorStore.minecraftVersion) return true
      if ($generatorStore.loaderType !== 'vanilla' && !$generatorStore.loaderVersion) return true
    }
    if ($generatorStore.step === 4) {
      return !$generatorStore.root
    }
    if ($generatorStore.step === 6) {
      if ($generatorStore.javaInstall === 'manual') {
        if ($generatorStore.javaPathType === 'relative') {
          return !$generatorStore.javaRelativePath
        } else {
          return !$generatorStore.javaAbsolutePath
        }
      }
    }
    return false
  })

  function next() {
    generatorStore.update((s) => ({ ...s, step: s.step + 1 }))
  }
  function prev() {
    generatorStore.update((s) => ({ ...s, step: s.step - 1 }))
  }

  async function handleFinish() {
    isFinished = true

    try {
      await navigator.clipboard.writeText(`const config: Config = ${configJson}`)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#27c93f', '#ffbd2e', '#ff5f56', '#569cd6']
    })
  }

  let listInputIgnore = $state('')
  let listInputGameArgs = $state('')
  let listInputJavaArgs = $state('')
  function addToList(target: 'gameArgs' | 'javaArgs' | 'cleaningIgnored') {
    if (target === 'cleaningIgnored' && !listInputIgnore.trim()) return
    if (target === 'gameArgs' && !listInputGameArgs.trim()) return
    if (target === 'javaArgs' && !listInputJavaArgs.trim()) return
    let value = target === 'cleaningIgnored' ? listInputIgnore : target === 'gameArgs' ? listInputGameArgs : listInputJavaArgs
    generatorStore.update((s) => ({ ...s, [target]: [...s[target], value] }))
    if (target === 'cleaningIgnored') {
      listInputIgnore = ''
    } else if (target === 'gameArgs') {
      listInputGameArgs = ''
    } else {
      listInputJavaArgs = ''
    }
  }

  function removeFromList(target: 'gameArgs' | 'javaArgs' | 'cleaningIgnored', index: number) {
    generatorStore.update((s) => ({ ...s, [target]: s[target].filter((_, i) => i !== index) }))
  }

  generatedConfig.subscribe((s) => {
    configJson = JSON.stringify(s, null, 2)
      .replaceAll(/^( *)\"([a-zA-Z]*)\":/gms, '$1$2:')
      .replaceAll('\"\/*', '/*')
      .replaceAll('\*\/\"', '*/')
  })
</script>

<SEO title="Config generator — EML Project" description="Generate the config object for EML Lib." />

<section class="hero small">
  <div class="container-layout">
    <h1 class="hero-title">Config generator</h1>
  </div>
</section>

<section class="container-layout">
  <div class="container">
    {#if !isFinished}
      <div class="generator-grid">
        <div class="form-card">
          <div class="step-content">
            {#if $generatorStore.step === 1}
              <div in:fade>
                <h3>Do you use the EML AdminTool?</h3>
                <p class="info">EML AdminTool is a self-hosted tool that allows you to manage your Minecraft launcher from a web interface.</p>
                <div class="options">
                  <button class:selected={$generatorStore.useAdminTool} onclick={() => ($generatorStore.useAdminTool = true)}
                    >Yes (recommended)</button
                  >
                  <button class:selected={!$generatorStore.useAdminTool} onclick={() => ($generatorStore.useAdminTool = false)}>
                    No (agnostic mode)
                  </button>
                </div>
                {#if $generatorStore.useAdminTool}
                  <div class="input-field">
                    <label for="eml-admintool-url">EML AdminTool URL</label>
                    <input id="eml-admintool-url" type="text" bind:value={$generatorStore.url} placeholder="https://..." />
                  </div>
                {/if}
              </div>
            {:else if $generatorStore.step === 2}
              <div in:fade>
                <h3>Do you use profiles?</h3>
                <p class="info">Profiles allow you to manage different configurations for your Minecraft server.</p>
                <div class="options">
                  <button class:selected={$generatorStore.useProfiles} onclick={() => ($generatorStore.useProfiles = true)}>Yes</button>
                  <button class:selected={!$generatorStore.useProfiles} onclick={() => ($generatorStore.useProfiles = false)}>No</button>
                </div>
                {#if $generatorStore.useProfiles && !$generatorStore.useAdminTool}
                  <div class="input-field">
                    <label for="default-profile-slug">Default profile slug</label>
                    <input id="default-profile-slug" type="text" bind:value={$generatorStore.slug} placeholder="server-1" />
                    <p class="info">
                      The default profile slug is used to name the game folder. You can adapt the config to allow multiple profiles with different
                      slugs.
                    </p>
                  </div>
                {/if}
              </div>
            {:else if $generatorStore.step === 3}
              <div in:fade>
                <h3>What version of Minecraft are you using?</h3>
                {#if $generatorStore.useAdminTool}
                  <p class="info">Versions are managed automatically via EML AdminTool.</p>
                {:else}
                  <p class="info">We provide many tools to help you configure this section:</p>
                  <ul class="info">
                    <li>
                      <a href="/resources/minecraft-versions" target="_blank">Minecraft versions</a>: Check the available versions for your Minecraft
                      installation.
                    </li>
                    <li>
                      <a href="/resources/loader-versions" target="_blank">Loader versions</a>: Check the available versions for your mod loader.
                    </li>
                    <li>
                      <a href="/resources/modpack-json-generator" target="_blank">Modpack JSON generator</a>: Generate the JSON file for your modpack.
                    </li>
                  </ul>
                  <div class="input-field">
                    <label for="minecraft-version">Minecraft version</label>
                    <input id="minecraft-version" type="text" bind:value={$generatorStore.minecraftVersion} placeholder="1.20.1" />
                  </div>
                  <div class="input-field">
                    <label for="loader-type">Loader type</label>
                    <select id="loader-type" style="width: 100%;" bind:value={$generatorStore.loaderType}>
                      <option value="vanilla">Vanilla</option>
                      <option value="forge">Forge</option>
                      <option value="neoforge">NeoForge</option>
                      <option value="fabric">Fabric</option>
                      <option value="quilt">Quilt</option>
                    </select>
                  </div>
                  {#if $generatorStore.loaderType !== 'vanilla'}
                    <div class="input-field">
                      <label for="loader-version">Loader version</label>
                      <input id="loader-version" type="text" bind:value={$generatorStore.loaderVersion} placeholder="47.2.0" />
                    </div>
                  {/if}
                  <div class="input-field">
                    <label for="modpack-url">Modpack URL (JSON)</label>
                    <input id="modpack-url" type="text" bind:value={$generatorStore.modpackUrl} placeholder="https://..." />
                  </div>
                {/if}
              </div>
            {:else if $generatorStore.step === 4}
              <div in:fade>
                <h3>How to name your server folder?</h3>
                <div class="input-field">
                  <label for="root-folder">Root folder name (without the dot)</label>
                  <input id="root-folder" type="text" bind:value={$generatorStore.root} placeholder="my-server" />
                </div>
                {#if $generatorStore.useProfiles}
                  <h3 style="margin-top: 30px;">How to store your profiles?</h3>
                  <div class="options">
                    <button class:selected={$generatorStore.storage === 'isolated'} onclick={() => ($generatorStore.storage = 'isolated')}>
                      Isolated
                    </button>
                    <button class:selected={$generatorStore.storage === 'shared'} onclick={() => ($generatorStore.storage = 'shared')}>Shared</button>
                  </div>
                  {#if $generatorStore.storage === 'isolated'}
                    <p class="info">
                      Each profile will have its own root folder in <code>.root/slug/</code>. Nothing will be shared between profiles. This is the
                      safest option, but uses more disk space.
                    </p>
                  {:else if $generatorStore.storage === 'shared'}
                    <p class="info">
                      All profiles will share the same root folder (assets, libraries, ...). Specific files such as mods will be stored in
                      <code>.root/slug/</code>. This option implies disabling the cleaner.
                    </p>
                  {/if}
                {/if}
              </div>
            {:else if $generatorStore.step === 5}
              <div in:fade>
                <h3>Do you want to enable file cleaning between launches?</h3>
                {#if $generatorStore.useProfiles && $generatorStore.storage === 'shared'}
                  <p class="info">Cleaning is disabled when using shared storage with profiles, as it would affect all profiles.</p>
                {:else}
                  <p class="info">EML Lib can automatically remove unwanted files (mods, versions, ...) between launches.</p>
                  <div class="options">
                    <button class:selected={$generatorStore.cleaningEnabled} onclick={() => ($generatorStore.cleaningEnabled = true)}>
                      Yes (recommended)
                    </button>
                    <button class:selected={!$generatorStore.cleaningEnabled} onclick={() => ($generatorStore.cleaningEnabled = false)}> No </button>
                  </div>
                  {#if $generatorStore.cleaningEnabled}
                    <div class="list-manager">
                      <label for="ignored">Ignored files and folders (that will not be cleaned)</label>
                      <div class="flex">
                        <input
                          id="ignored"
                          type="text"
                          bind:value={listInputIgnore}
                          placeholder="ex: logs/"
                          onkeypress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addToList('cleaningIgnored')
                            }
                          }}
                        />
                        <button onclick={() => addToList('cleaningIgnored')}><i class="fa-solid fa-plus"></i></button>
                      </div>
                    </div>
                    {#if $generatorStore.cleaningIgnored.length > 0}
                      <div class="tag-cloud">
                        {#each $generatorStore.cleaningIgnored as item, i}
                          <span class="tag">
                            {item}
                            <button class="delete" onclick={() => removeFromList('cleaningIgnored', i)}><i class="fa-solid fa-times"></i></button>
                          </span>
                        {/each}
                      </div>
                    {/if}
                  {/if}
                {/if}
              </div>
            {:else if $generatorStore.step === 6}
              <div in:fade>
                <h3>Do you want to install Java automatically?</h3>
                <div class="options">
                  <button class:selected={$generatorStore.javaInstall === 'auto'} onclick={() => ($generatorStore.javaInstall = 'auto')}>
                    Yes (recommended)
                  </button>
                  <button class:selected={$generatorStore.javaInstall === 'manual'} onclick={() => ($generatorStore.javaInstall = 'manual')}>
                    No
                  </button>
                </div>
                {#if $generatorStore.javaInstall === 'manual'}
                  <h3 style="margin-top: 30px;">Where is Java installed?</h3>
                  <div class="options">
                    <button class:selected={$generatorStore.javaPathType === 'absolute'} onclick={() => ($generatorStore.javaPathType = 'absolute')}>
                      Provide absolute path
                    </button>
                    <button class:selected={$generatorStore.javaPathType === 'relative'} onclick={() => ($generatorStore.javaPathType = 'relative')}>
                      Provide relative path (to server root)
                    </button>
                  </div>
                  {#if $generatorStore.javaPathType === 'relative'}
                    <div class="input-field">
                      <label for="java-relative-path">Relative path (to server root)</label>
                      <input type="text" id="java-relative-path" bind:value={$generatorStore.javaRelativePath} placeholder="runtime/jre-8/..." />
                    </div>
                  {:else}
                    <div class="input-field">
                      <label for="java-absolute-path">Absolute path</label>
                      <input type="text" id="java-absolute-path" bind:value={$generatorStore.javaAbsolutePath} placeholder="C:/Program Files/..." />
                    </div>
                    <p class="info">
                      You can use environment variables in the path, for example: <code>%JAVA_HOME%/bin/java</code> on Windows or
                      <code>$JAVA_HOME/bin/java</code> on Linux/Mac. You can also type <code>java</code> if the Java executable is in the system PATH,
                      but providing the full path is recommended to avoid issues with different Java versions.<br />
                      If you want to make your launcher work on different OS, using environment variables or relative paths is recommended.
                    </p>
                  {/if}
                {/if}
              </div>
            {:else if $generatorStore.step === 7}
              <div in:fade>
                <h3>Game & JVM arguments (advanced)</h3>
                <p class="info">
                  These are advanced options for configuring the game and JVM arguments. Use only if you know what you are doing.<br />
                  The order of the arguments is important.
                </p>
                <div class="list-manager">
                  <label for="java-args">JVM arguments</label>
                  <div class="flex">
                    <input
                      type="text"
                      id="java-args"
                      bind:value={listInputJavaArgs}
                      onkeypress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addToList('javaArgs')
                        }
                      }}
                    />
                    <button onclick={() => addToList('javaArgs')}><i class="fa-solid fa-plus"></i></button>
                  </div>
                </div>
                {#if $generatorStore.javaArgs.length > 0}
                  <div class="tag-cloud">
                    {#each $generatorStore.javaArgs as arg, i}
                      <span class="tag">
                        {arg} <button class="delete" onclick={() => removeFromList('javaArgs', i)}><i class="fa-solid fa-times"></i></button>
                      </span>
                    {/each}
                  </div>
                {/if}
                <div class="list-manager">
                  <label for="game-args">Minecraft arguments</label>
                  <div class="flex">
                    <input
                      type="text"
                      id="game-args"
                      bind:value={listInputGameArgs}
                      onkeypress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addToList('gameArgs')
                        }
                      }}
                    />
                    <button onclick={() => addToList('gameArgs')}><i class="fa-solid fa-plus"></i></button>
                  </div>
                </div>
                {#if $generatorStore.gameArgs.length > 0}
                  <div class="tag-cloud">
                    {#each $generatorStore.gameArgs as arg, i}
                      <span class="tag">
                        {arg} <button class="delete" onclick={() => removeFromList('gameArgs', i)}><i class="fa-solid fa-times"></i></button>
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <div class="actions">
            {#if $generatorStore.step < steps.length}
              <button class="button primary" onclick={next} {disabled}>Next</button>
            {/if}
            {#if $generatorStore.step === steps.length}
              <button class="button primary" onclick={handleFinish}>Done!</button>
            {/if}
            {#if $generatorStore.step > 1}
              <button class="button secondary" onclick={prev}>Previous</button>
            {/if}
          </div>
        </div>

        <div class="preview-card">
          <div class="code-block">
            <div class="code-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="filename">launcher.ts</span>
            </div>
            <pre><code>{@html hljs.highlight(configJson, { language: 'typescript' }).value}</code></pre>
          </div>
        </div>
      </div>
    {:else}
      <div class="finished-view" in:scale={{ start: 0.90, duration: 300, easing: backOut }} style="position: relative;">
        <button class="a" onclick={() => (isFinished = false)} style="position: absolute; top: 0; left: 0;">
          <i class="fa-solid fa-arrow-left"></i> Edit configuration
        </button>
        <div class="success-message">
          <i class="fa-solid fa-circle-check"></i>
          <h2>Configuration ready!</h2>
          <p>The code has been copied to your clipboard.</p>
        </div>

        <div class="code-block large">
          <div class="code-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="filename">launcher.ts</span>
            <span class="status-badge">Copied!</span>
          </div>
          <pre><code>{@html hljs.highlight(`const config: Config = ${configJson}`, { language: 'typescript' }).value}</code></pre>
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
