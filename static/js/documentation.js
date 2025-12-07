const contentElement = document.getElementById('doc-content')
const sidebarLinks = document.querySelectorAll('#doc-sidebar a')
const defaultPage = '1.1-required-knowledge'

function setActiveLink(id) {
  sidebarLinks.forEach((link) => {
    if (link.href.endsWith(`#${id}`)) {
      link.classList.add('active')
      const detailsParent = link.closest('details')
      if (detailsParent && !detailsParent.open) {
        detailsParent.open = true
      }
    } else {
      link.classList.remove('active')
    }
  })
}

function processAdmonitions() {
  const admonitionsTitle = { note: 'Note', tip: 'Tip', warning: 'Warning', important: 'Important', caution: 'Caution' }
  const admonitionRegex = /^\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/i

  contentElement.querySelectorAll('blockquote').forEach((quote) => {
    const firstParagraph = quote.querySelector('p')
    if (!firstParagraph) return

    const text = firstParagraph.innerHTML
    const match = text.match(admonitionRegex)

    if (match) {
      const type = match[1].toLowerCase()

      const admonitionDiv = document.createElement('div')
      admonitionDiv.className = `admonition ${type}`

      const title = document.createElement('p')
      title.className = 'admonition-title'
      title.textContent = admonitionsTitle[type]
      admonitionDiv.appendChild(title)

      firstParagraph.innerHTML = text.replace(admonitionRegex, '')

      while (quote.firstChild) {
        admonitionDiv.appendChild(quote.firstChild)
      }

      quote.parentNode.replaceChild(admonitionDiv, quote)
    }
  })
}

function processTabs() {
  const nodes = Array.from(contentElement.childNodes)

  let inTabGroup = false
  let currentTabContainer = null
  let currentTabContent = null
  let currentTabNav = null
  let tabCounter = 0

  nodes.forEach((node, index) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      const commentValue = node.nodeValue.trim()

      if (commentValue === 'TABS:START') {
        inTabGroup = true
        tabCounter++

        currentTabContainer = document.createElement('div')
        currentTabContainer.className = 'tabs-container'

        currentTabNav = document.createElement('div')
        currentTabNav.className = 'tabs-nav'

        currentTabContent = document.createElement('div')
        currentTabContent.className = 'tabs-content'

        currentTabContainer.appendChild(currentTabNav)
        currentTabContainer.appendChild(currentTabContent)

        contentElement.insertBefore(currentTabContainer, node)
        node.remove()
        return
      }

      if (commentValue === 'TABS:END') {
        inTabGroup = false

        if (currentTabNav?.firstChild) {
          currentTabNav.firstChild.classList.add('active')
        }
        if (currentTabContent?.firstChild) {
          currentTabContent.firstChild.classList.add('active')
        }

        currentTabContainer = null
        currentTabContent = null
        currentTabNav = null
        node.remove()
        return
      }
    }

    if (inTabGroup && currentTabContainer) {
      if (node.nodeType === Node.COMMENT_NODE && node.nodeValue?.trim().startsWith('TABNAME:')) {
        const navContainer = currentTabNav
        const contentContainer = currentTabContent

        const tabId = `tab-${tabCounter}-${currentTabNav.children.length}`
        const paneId = `pane-${tabCounter}-${currentTabNav.children.length}`

        const button = document.createElement('button')
        button.className = 'tabs-nav-button'
        button.textContent = node.nodeValue.replace('TABNAME:', '').trim()
        button.setAttribute('role', 'tab')
        button.setAttribute('aria-controls', paneId)

        const pane = document.createElement('div')
        pane.className = 'tab-pane'
        pane.id = paneId
        pane.setAttribute('role', 'tabpanel')

        button.addEventListener('click', () => {
          Array.from(navContainer.children).forEach((btn) => btn.classList.remove('active'))
          Array.from(contentContainer.children).forEach((p) => p.classList.remove('active'))

          button.classList.add('active')
          pane.classList.add('active')
        })

        currentTabNav.appendChild(button)
        currentTabContent.appendChild(pane)

        node.remove()
      } else if (currentTabContent?.lastChild) {
        currentTabContent.lastChild.appendChild(node)
      } else if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
        node.remove()
      }
    }
  })
}

function updateNavigationButtons(currentPageId) {
  const existingNav = contentElement.querySelector('.doc-nav')
  if (existingNav) {
    existingNav.remove()
  }

  const links = Array.from(sidebarLinks)
  const currentIndex = links.findIndex((link) => link.href.endsWith(`#${currentPageId}`))

  if (currentIndex === -1) {
    return
  }

  const prevLink = currentIndex > 0 ? links[currentIndex - 1] : null
  const nextLink = currentIndex < links.length - 1 ? links[currentIndex + 1] : null

  const navContainer = document.createElement('div')
  navContainer.className = 'doc-nav'

  if (prevLink) {
    const prevButton = document.createElement('a')
    prevButton.className = 'nav-button prev'
    prevButton.href = prevLink.href
    prevButton.innerHTML = `
      <span><i class="fa-solid fa-arrow-left"></i> Previous</span>
      <strong>${prevLink.textContent}</strong>
    `
    navContainer.appendChild(prevButton)
  }

  if (nextLink) {
    const nextButton = document.createElement('a')
    nextButton.className = 'nav-button next'
    nextButton.href = nextLink.href
    nextButton.innerHTML = `
      <span>Next <i class="fa-solid fa-arrow-right"></i></span>
      <strong>${nextLink.textContent}</strong>
    `
    navContainer.appendChild(nextButton)
  }

  if (prevLink || nextLink) {
    contentElement.appendChild(navContainer)
  }
}

async function loadMarkdown(pageId) {
  if (!pageId) pageId = defaultPage

  try {
    const res = await fetch(`/static/markdown/${pageId}.md`)

    if (!res.ok) {
      throw new Error(`Fichier ${pageId}.md non trouvé.`)
    }

    const markdown = await res.text()

    contentElement.innerHTML = marked.parse(markdown, { gfm: true })

    processAdmonitions()
    processTabs()

    contentElement.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })

    setActiveLink(pageId)
    updateNavigationButtons(pageId)
  } catch (error) {
    console.error(error)
    contentElement.innerHTML = `
      <h2>Erreur 404</h2>
      <p>Le document demandé (<code>${pageId}.md</code>) n'a pas pu être trouvé.</p>`
    setActiveLink(null)
    updateNavigationButtons(null)
  }
}

function handleHashChange() {
  const pageId = location.hash.substring(1)
  loadMarkdown(pageId)
  window.scrollTo(0, 176)
}

document.addEventListener('DOMContentLoaded', () => {
  if (location.hash) {
    handleHashChange()
  } else {
    loadMarkdown(defaultPage)
  }
  globalThis.addEventListener('hashchange', handleHashChange)
})

