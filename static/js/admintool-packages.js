document.addEventListener('DOMContentLoaded', async () => {
  const versionsGrid = document.getElementById('versions-list')
  const channelFilter = document.getElementById('channel-filter')
  const curlRadio = document.getElementById('curl')
  const wgetRadio = document.getElementById('wget')
  const searchInput = document.getElementById('version-search')

  let allData = []

  window.copyCommand = (cmd, btnId) => {
    navigator.clipboard.writeText(cmd).then(() => {
      const icon = document.getElementById(`copy-icon-${btnId}`)
      if (icon) {
        icon.classList.remove('fa-regular', 'fa-copy')
        icon.classList.add('fa-solid', 'fa-check')
        setTimeout(() => {
          icon.classList.remove('fa-solid', 'fa-check')
          icon.classList.add('fa-regular', 'fa-copy')
        }, 2000)
      }
    })
  }

  const createCard = (release, index, commandTool) => {
    const date = new Date(release.published_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const isLatest = release.is_latest
    const isPrerelease = release.is_prerelease

    let badgeHtml = ''
    if (isLatest) badgeHtml += `<span class="badge latest">Latest</span>`
    if (isPrerelease) badgeHtml += `<span class="badge beta">Pre-release</span>`
    if (!isLatest && !isPrerelease) badgeHtml += `<span class="badge stable">Stable</span>`
    let targetUrl = release.installer_urls[0]

    if (isLatest) {
      const latestUrl = release.installer_urls.find((u) => u.endsWith('@latest'))
      if (latestUrl) targetUrl = latestUrl
    }

    let installCmd = ''
    if (commandTool === 'curl') installCmd = `curl -sSL ${targetUrl} | bash`
    else installCmd = `wget -qO- ${targetUrl} | bash`

    return `
          <div class="version-card">
            <div class="version-header">
              <div class="version-tag">
                EML AdminTool v${release.version} ${badgeHtml}
              </div>
              <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2/releases/tag/v${release.version}" target="_blank" class="not-a" title="See on GitHub" style="color: #aaa;">
                <i class="fa-brands fa-github"></i>
              </a>
            </div>
          
            <div class="version-meta">
              <p style="margin: 0;"><i class="fa-regular fa-calendar"></i> Published on ${date}</p>
            </div>
            <pre onclick="copyCommand('${installCmd}', '${index}')"><code>${installCmd}</code><i class="fa-regular fa-copy" id="copy-icon-${index}"></i></pre>
          </div>
        `
  }

  const render = () => {
    const commandTool = curlRadio.checked ? 'curl' : 'wget'
    const channel = channelFilter.value
    const search = searchInput.value.toLowerCase()

    const filtered = allData.filter((r) => {
      const versionToSearch = r.version === 'latest' ? r.real_version : r.version

      if (channel === 'stable' && r.is_prerelease) return false
      if (channel === 'beta' && !r.is_prerelease && r.version !== 'latest') return false

      if (search && !versionToSearch.toLowerCase().includes(search)) return false

      return true
    })

    if (filtered.length === 0) {
      versionsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">No package found.</p>`
      return
    }

    versionsGrid.innerHTML = filtered.map((r, i) => createCard(r, i, commandTool)).join('')
  }

  try {
    const res = await fetch('/api/releases')
    if (!res.ok) throw new Error('Erreur API')

    const rawData = await res.json()
    const latestEntry = rawData.find((r) => r.version === 'latest')

    if (latestEntry) {
      allData = rawData.filter((r) => r.version === 'latest' || r.version !== latestEntry.real_version)
    } else {
      allData = rawData
    }

    render()
  } catch (err) {
    console.error(err)
    versionsGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; color: #b91c1c;">
          Unable to load packages. Please try again later.
        </div>`
  }

  channelFilter.addEventListener('change', render)
  searchInput.addEventListener('input', render)
  curlRadio.addEventListener('change', render)
  wgetRadio.addEventListener('change', render)
})

