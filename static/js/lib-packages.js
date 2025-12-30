document.addEventListener('DOMContentLoaded', async () => {
  const PACKAGE_NAME = 'eml-lib'

  const versionsGrid = document.getElementById('versions-list')
  const channelFilter = document.getElementById('channel-filter')
  const searchInput = document.getElementById('version-search')

  const npmRadio = document.getElementById('npm')
  const yarnRadio = document.getElementById('yarn')
  const pnpmRadio = document.getElementById('pnpm')

  let allVersions = []

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

  const createCard = (pkg, index, tool) => {
    const date = new Date(pkg.date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const isLatest = pkg.isLatest
    const isPrerelease = pkg.isPrerelease

    let badgeHtml = ''
    if (isLatest) badgeHtml += `<span class="badge latest">Latest</span>`
    if (isPrerelease) badgeHtml += `<span class="badge beta">Pre-release</span>`
    if (!isLatest && !isPrerelease) badgeHtml += `<span class="badge stable">Stable</span>`

    let installCmd = ''
    const targetVersion = isLatest ? '' : `@${pkg.version}`

    if (tool === 'npm') installCmd = `npm install ${PACKAGE_NAME}${targetVersion}`
    else if (tool === 'yarn') installCmd = `yarn add ${PACKAGE_NAME}${targetVersion}`
    else if (tool === 'pnpm') installCmd = `pnpm add ${PACKAGE_NAME}${targetVersion}`

    return `
      <div class="version-card">
        <div class="version-header">
          <div class="version-tag">
            EML Lib v${pkg.version} ${badgeHtml}
          </div>
          <a href="https://www.npmjs.com/package/${PACKAGE_NAME}/v/${pkg.version}" target="_blank" class="not-a" title="See on npm" style="color: #aaa;">
            <i class="fa-brands fa-npm"></i>
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
    let tool = 'npm'
    if (yarnRadio.checked) tool = 'yarn'
    if (pnpmRadio.checked) tool = 'pnpm'

    const channel = channelFilter.value
    const search = searchInput.value.toLowerCase()

    const filtered = allVersions.filter((r) => {
      if (channel === 'stable' && r.isPrerelease) return false
      if (channel === 'beta' && !r.isPrerelease) return false // On peut vouloir afficher latest dans beta aussi ? Sinon garder votre logique.

      if (search && !r.version.toLowerCase().includes(search)) return false
      return true
    })

    if (filtered.length === 0) {
      versionsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">No package found.</p>`
      return
    }

    versionsGrid.innerHTML = filtered.map((r, i) => createCard(r, i, tool)).join('')
  }

  try {
    const res = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`)
    if (!res.ok) throw new Error(`npm Registry Error: ${res.status}`)

    const rawData = await res.json()

    const latestVersion = rawData['dist-tags'].latest
    const versionKeys = Object.keys(rawData.versions)

    allVersions = versionKeys.map((ver) => {
      return {
        version: ver,
        date: rawData.time[ver],
        isLatest: ver === latestVersion,
        isPrerelease: ver.includes('-')
      }
    })

    allVersions.sort((a, b) => new Date(b.date) - new Date(a.date))

    render()
  } catch (err) {
    console.error(err)
    versionsGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; color: #b91c1c;">
          Unable to load packages from npm.<br> <small>${err.message}</small>
        </div>`
  }

  channelFilter.addEventListener('change', render)
  searchInput.addEventListener('input', render)
  npmRadio.addEventListener('change', render)
  yarnRadio.addEventListener('change', render)
  pnpmRadio.addEventListener('change', render)
})
