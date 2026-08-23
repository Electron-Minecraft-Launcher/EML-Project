<script lang="ts">
  import { goto } from '$app/navigation'
  import { AVAILABLE_VERSIONS, DEFAULT_VERSION, type DocVersion } from '$lib/config/docs'

  interface Props {
    currentVersion?: DocVersion
  }

  let { currentVersion = DEFAULT_VERSION }: Props = $props()

  function handleVersionChange(event: Event) {
    const select = event.target as HTMLSelectElement
    const newVersion = select.value as DocVersion
    goto(`/docs/${newVersion}`)
  }
</script>

<div class="version-select-container">
  <label for="doc-version-select">
    <i class="fa-solid fa-code-branch"></i> Documentation version:
  </label>
  <select id="doc-version-select" value={currentVersion} onchange={handleVersionChange}>
    {#each AVAILABLE_VERSIONS as v}
      <option value={v}>
        EML {v} {v === DEFAULT_VERSION ? '(latest)' : ''}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  .version-select-container {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    padding: 10px 16px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    width: calc(100% - 34px);

    label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
    }

    select {
      margin-top: 0;
    }
  }
</style>