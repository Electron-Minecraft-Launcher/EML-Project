import { visit } from 'unist-util-visit'

/**
 * Remark plugin to transform blockquotes starting with [!NOTE], [!TIP], etc. into styled alert boxes.
 */
export function remarkAlert() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const paragraph = node.children[0]
      if (!paragraph || paragraph.type !== 'paragraph') return

      const firstChild = paragraph.children[0]
      if (!firstChild) return

      let admonitionType = null

      if (firstChild.type === 'linkReference') {
        const label = firstChild.label

        if (label && label.startsWith('!')) {
          const potentialType = label.slice(1).toLowerCase()
          const validTypes = ['note', 'tip', 'warning', 'important', 'caution']

          if (validTypes.includes(potentialType)) {
            admonitionType = potentialType
            paragraph.children.shift()
          }
        }
      }

      else if (firstChild.type === 'text') {
        const regex = /^\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/i
        const match = firstChild.value.match(regex)
        if (match) {
          admonitionType = match[1].toLowerCase()
          firstChild.value = firstChild.value.replace(regex, '')
        }
      }

      if (admonitionType) {
        const titleText = admonitionType.charAt(0).toUpperCase() + admonitionType.slice(1)

        node.data = node.data ?? {}
        node.data.hName = 'div'
        node.data.hProperties = {
          className: ['admonition', admonitionType]
        }

        const titleNode = {
          type: 'paragraph',
          data: {
            hProperties: { className: ['admonition-title'] }
          },
          children: [{ type: 'text', value: titleText }]
        }

        node.children.unshift(titleNode)
      }
    })
  }
}
