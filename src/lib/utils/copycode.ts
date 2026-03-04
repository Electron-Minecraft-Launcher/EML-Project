import { mount, unmount } from 'svelte'
import CopyButton from '$lib/components/CopyButton.svelte'

export function copyCode(node: HTMLElement, _: any) {
  let components: ReturnType<typeof mount>[] = []

  function init() {
    cleanup()

    setTimeout(() => {
      const preElements = node.querySelectorAll('pre')

      preElements.forEach((pre) => {
        if (getComputedStyle(pre).position === 'static') {
          pre.style.position = 'relative'
        }

        const codeText = pre.textContent ?? ''

        const btn = mount(CopyButton, {
          target: pre,
          props: { text: codeText }
        })

        components.push(btn)
      })
    }, 0)
  }

  function cleanup() {
    components.forEach((comp) => unmount(comp))
    components = []
  }

  init()

  return {
    destroy() {
      cleanup()
    },
    update(_: any) {
      init()
    }
  }
}
