import adapter from '@sveltejs/adapter-cloudflare'
import { sveltePreprocess } from 'svelte-preprocess'
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    sveltePreprocess(),
    mdsvex({
      extensions: ['.md']
    })
  ],
  compilerOptions: {
    warningFilter: (warning) => !warning.code?.includes('unused')
  },
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('css-unused-selector')) return
    handler(warning)
  },
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    })
  }
}

export default config




