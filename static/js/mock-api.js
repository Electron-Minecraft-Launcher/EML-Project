;(async function () {
  // ============================================================
  // 1. Environment
  // ============================================================
  const LOCAL_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0']
  if (!LOCAL_DOMAINS.includes(window.location.hostname) && !window.location.hostname.startsWith('192.168.')) return

  console.log(
    '%c⚡ LOCAL RUNTIME ENABLED: Running real backend code in the browser.',
    'background: #7c3aed; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  )

  // ============================================================
  // 2. Polyfills
  // ============================================================

  if (typeof window.caches === 'undefined') {
    window.caches = {}
  }

  if (!window.caches.default) {
    const memoryCache = new Map()

    window.caches.default = {
      match: async (req) => {
        const url = req?.url ?? req
        console.debug(`[Cache Mock] Read: ${url}`)
        const cached = memoryCache.get(url)
        return cached ? cached.clone() : undefined
      },
      put: async (req, res) => {
        const url = req?.url ?? req
        console.debug(`[Cache Mock] Write: ${url}`)
        memoryCache.set(url, res.clone())
      }
    }
  }

  // ============================================================
  // 3. Intercepter
  // ============================================================

  const originalFetch = window.fetch

  window.fetch = async (url, options) => {
    const urlObj = new URL(url, window.location.origin)
    const path = urlObj.pathname

    if (path.includes('/api/releases')) {
      console.log(`[Local Runtime] Running functions/api/releases.js...`)

      try {
        const module = await import('/functions/api/releases.js')

        const context = {
          request: new Request(url, options),
          env: {
            GITHUB_TOKEN: undefined
          },
          params: {},
          waitUntil: () => {}
        }

        return await module.onRequest(context)
      } catch (err) {
        console.error('[Local Runtime Error]', err)
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 })
      }
    }

    const installMatch = path.match(/^\/install\/(.+)/)
    if (installMatch) {
      console.log(`[Local Runtime] Running functions/install/[id].js...`)

      try {
        const module = await import('/functions/install/[id].js')
        const fullId = installMatch[1]

        const context = {
          request: new Request(url, options),
          env: {},
          params: { id: fullId },
          waitUntil: () => {}
        }

        return await module.onRequest(context)
      } catch (err) {
        console.error('[Local Runtime Error]', err)
        return new Response(`Erreur locale: ${err.message}`, { status: 500 })
      }
    }

    return originalFetch(url, options)
  }
})()

