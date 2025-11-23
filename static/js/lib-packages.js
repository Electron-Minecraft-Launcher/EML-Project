document.addEventListener('DOMContentLoaded', async () => {
  // CONFIGURATION DU PAQUET
  const PACKAGE_NAME = 'eml-lib' // Changez ceci si c'est @electron-minecraft-launcher/eml-lib

  const versionsGrid = document.getElementById('versions-list')
  const channelFilter = document.getElementById('channel-filter')
  const searchInput = document.getElementById('version-search')

  // Récupération des radios
  const npmRadio = document.getElementById('npm')
  const yarnRadio = document.getElementById('yarn')
  const pnpmRadio = document.getElementById('pnpm')

  let allVersions = [] // Liste transformée et triée

  // Fonction de copie (identique à la vôtre)
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
    // Formatage de la date
    const date = new Date(pkg.date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const isLatest = pkg.isLatest
    const isPrerelease = pkg.isPrerelease

    // Badges
    let badgeHtml = ''
    if (isLatest) badgeHtml += `<span class="badge latest">Latest</span>`
    if (isPrerelease) badgeHtml += `<span class="badge beta">Pre-release</span>`
    if (!isLatest && !isPrerelease) badgeHtml += `<span class="badge stable">Stable</span>`

    // Construction de la commande
    let installCmd = ''
    const targetVersion = isLatest ? '' : `@${pkg.version}` // NPM installe latest par défaut si vide

    if (tool === 'npm') installCmd = `npm install ${PACKAGE_NAME}${targetVersion}`
    else if (tool === 'yarn') installCmd = `yarn add ${PACKAGE_NAME}${targetVersion}`
    else if (tool === 'pnpm') installCmd = `pnpm add ${PACKAGE_NAME}${targetVersion}`

    return `
      <div class="version-card">
        <div class="version-header">
          <div class="version-tag">
            v${pkg.version} ${badgeHtml}
          </div>
          <a href="https://www.npmjs.com/package/${PACKAGE_NAME}/v/${pkg.version}" target="_blank" class="not-a" title="See on NPM" style="color: #aaa;">
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
    // Détection de l'outil sélectionné
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
    // Appel direct au registre NPM
    const res = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`)
    if (!res.ok) throw new Error(`NPM Registry Error: ${res.status}`)

    const rawData = await res.json()

    // TRAITEMENT DES DONNÉES NPM
    // NPM renvoie un objet avec "versions" (map) et "time" (map).
    // On doit fusionner tout ça dans un tableau propre.

    const latestVersion = rawData['dist-tags'].latest
    const versionKeys = Object.keys(rawData.versions)

    allVersions = versionKeys.map((ver) => {
      return {
        version: ver,
        date: rawData.time[ver], // La date est dans l'objet 'time'
        isLatest: ver === latestVersion,
        // Détection simple de pre-release (contient un tiret, ex: 2.0.0-beta.1)
        isPrerelease: ver.includes('-')
      }
    })

    // Tri par date décroissante (le plus récent en haut)
    allVersions.sort((a, b) => new Date(b.date) - new Date(a.date))

    render()
  } catch (err) {
    console.error(err)
    versionsGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; color: #b91c1c;">
          Unable to load packages from NPM. <br> <small>${err.message}</small>
        </div>`
  }

  // Listeners
  channelFilter.addEventListener('change', render)
  searchInput.addEventListener('input', render)
  npmRadio.addEventListener('change', render)
  yarnRadio.addEventListener('change', render)
  pnpmRadio.addEventListener('change', render)
})
