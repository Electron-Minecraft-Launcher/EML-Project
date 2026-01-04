<script lang="ts">
  interface Props {
    text: string
  }

  let { text }: Props = $props()
  let copied = $state(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  }
</script>

<button class="copy-button" class:copied onclick={handleCopy} aria-label="Copy code">
  {#if copied}
    <i class="fa-solid fa-check"></i>
  {:else}
    <i class="fa-regular fa-copy"></i>
  {/if}
</button>

<style>
  .copy-button {
    position: absolute;
    top: 14px;
    right: 14px;
    border: none;
    border-radius: 4px;
    height: 24.4px;
    border: 1px solid var(--border-color);
    padding: 4px 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    z-index: 10;
    opacity: 0;
    background-color: var(--secondary-color);
    color: var(--text-dark-color);
  }

  :global(pre:hover) .copy-button,
  .copy-button:focus {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  .copy-button:hover {
    background-color: var(--secondary-color-hover);
  }

  .copy-button.copied {
    color: #10b981;
    border-color: #10b981;
    opacity: 1;
  }
</style>
