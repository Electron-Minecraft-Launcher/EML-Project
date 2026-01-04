import adapter from '@sveltejs/adapter-cloudflare'
import { sveltePreprocess } from 'svelte-preprocess'
import { mdsvex, escapeSvelte } from 'mdsvex'
import { remarkAlert } from './plugins/remark.js'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import plaintext from 'highlight.js/lib/languages/plaintext'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('python', python)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerAliases('plaintext', ['text', 'txt'])

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    sveltePreprocess(),
    mdsvex({
      extensions: ['.md'],
      highlight: {
        highlighter: (code, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            try {
              const highlighted = hljs.highlight(code, { language: lang }).value
              return `<pre class="language-${lang}"><code class="language-${lang} hljs">${escapeSvelte(highlighted)}</code></pre>`
            } catch (e) {
              console.error(e)
            }
          }

          const escapedCode = code
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;')

          return `<pre class="language-text"><code class="language-text hljs">${escapeSvelte(escapedCode)}</code></pre>`
        }
      },
      remarkPlugins: [remarkAlert],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
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




