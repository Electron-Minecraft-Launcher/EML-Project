async function includeHTML(selector, file) {
  const el = document.querySelector(selector)
  const res = await fetch(file)
  if (res.ok) el.innerHTML = await res.text()
}

async function responsive() {
  // --- 1. GESTION DU MENU PRINCIPAL (HEADER) ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-toggle')
  const mainNav = document.querySelector('.main-nav')

  if (mobileMenuBtn && mainNav) {
    // Création de l'overlay spécifique au menu
    const menuOverlay = document.createElement('div')
    menuOverlay.className = 'menu-overlay' // Classe CSS qu'on va définir
    document.body.appendChild(menuOverlay)

    function toggleMenu() {
      const isActive = mainNav.classList.toggle('active')
      menuOverlay.classList.toggle('active') // On active/désactive le voile

      // Gestion de l'icône (Bars <-> Croix)
      const icon = mobileMenuBtn.querySelector('i')
      if (isActive) {
        icon.classList.remove('fa-bars')
        icon.classList.add('fa-xmark')
      } else {
        icon.classList.remove('fa-xmark')
        icon.classList.add('fa-bars')
      }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu)
    menuOverlay.addEventListener('click', toggleMenu) // Ferme si on clique à côté

    // Fermer le menu si on clique sur un lien
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        // Petite pause pour laisser l'animation de clic se faire
        setTimeout(() => {
          if (mainNav.classList.contains('active')) toggleMenu()
        }, 150)
      })
    })
  }

  // --- 2. GESTION DE LA SIDEBAR DOC (Code inchangé) ---
  const docOpenBtn = document.getElementById('doc-menu-toggle')
  const docCloseBtn = document.getElementById('doc-close-btn')
  const sidebar = document.getElementById('doc-sidebar')

  if (docOpenBtn && sidebar) {
    const overlay = document.createElement('div')
    overlay.className = 'doc-overlay'
    document.body.appendChild(overlay)

    function closeSidebar() {
      sidebar.classList.remove('active')
      overlay.classList.remove('active')
    }

    function openSidebar() {
      sidebar.classList.add('active')
      overlay.classList.add('active')
    }

    docOpenBtn.addEventListener('click', openSidebar)
    overlay.addEventListener('click', closeSidebar)
    if (docCloseBtn) docCloseBtn.addEventListener('click', closeSidebar)

    sidebar.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setTimeout(closeSidebar, 150))
    })
  }
}

document.body.style.opacity = '0'
await includeHTML('header', `/static/layout/header.html`)
await includeHTML('footer', `/static/layout/footer.html`)
await responsive()
document.body.style.opacity = '1'
