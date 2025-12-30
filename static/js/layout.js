async function includeHTML(selector, file) {
  const el = document.querySelector(selector)
  const res = await fetch(file)
  if (res.ok) el.innerHTML = await res.text()
}

async function responsive() {
  // --- 1. HEADER MENU ---
  const menuBtn = document.querySelector('.mobile-menu-toggle')
  const nav = document.querySelector('.main-nav')

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active')

      // Changement d'icône
      const i = menuBtn.querySelector('i')
      if (nav.classList.contains('active')) {
        i.classList.remove('fa-bars')
        i.classList.add('fa-xmark')
      } else {
        i.classList.remove('fa-xmark')
        i.classList.add('fa-bars')
      }
    })
  }

  // --- 2. SIDEBAR DOC ---
  const docOpenBtn = document.getElementById('doc-menu-toggle')
  const docCloseBtn = document.getElementById('doc-close-btn') // Nouveau bouton
  const sidebar = document.getElementById('doc-sidebar')

  if (docOpenBtn && sidebar) {
    // Création Overlay
    const overlay = document.createElement('div')
    overlay.className = 'doc-overlay'
    document.body.appendChild(overlay)

    function openSidebar() {
      sidebar.classList.add('active')
      overlay.classList.add('active')
    }

    function closeSidebar() {
      sidebar.classList.remove('active')
      overlay.classList.remove('active')
    }

    // Événements
    docOpenBtn.addEventListener('click', openSidebar)
    overlay.addEventListener('click', closeSidebar)

    // Nouveau : clic sur la croix
    if (docCloseBtn) {
      docCloseBtn.addEventListener('click', closeSidebar)
    }

    // Fermer au clic sur un lien du menu
    sidebar.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        setTimeout(closeSidebar, 150)
      })
    })
  }
}

document.body.style.opacity = '0'
await includeHTML('header', `/static/layout/header.html`)
await includeHTML('footer', `/static/layout/footer.html`)
await responsive()
document.body.style.opacity = '1'
