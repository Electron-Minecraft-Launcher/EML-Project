export type DocPage = {
  title: string
  slug: string
  file: string
}

export type DocGroup = {
  type: 'group'
  title: string
  items: DocPage[]
}

export type DocPageEntry = {
  type: 'page'
} & DocPage

export type DocEntry = DocGroup | DocPageEntry

export type DocSection = {
  title: string
  entries: DocEntry[]
}

export const docsMenu: DocSection[] = [
  {
    title: 'Introduction',
    entries: [
      {
        type: 'page',
        title: 'What is EML?',
        slug: 'introduction/what-is-eml',
        file: '1-introduction/1-what-is-eml'
      },
      {
        type: 'page',
        title: 'Required knowledge',
        slug: 'introduction/required-knowledge',
        file: '1-introduction/2-required-knowledge'
      }
    ]
  },
  {
    title: 'EML AdminTool',
    entries: [
      {
        type: 'page',
        title: 'System requirements',
        slug: 'eml-admintool/system-requirements',
        file: '2-eml-admintool/1-system-requirements'
      },
      {
        type: 'group',
        title: 'Production setup',
        items: [
          {
            title: 'Install Docker',
            slug: 'eml-admintool/production-setup/install-docker',
            file: '2-eml-admintool/2-production-setup/1-install-docker'
          },
          {
            title: 'Install EML AdminTool',
            slug: 'eml-admintool/production-setup/install-eml-admintool',
            file: '2-eml-admintool/2-production-setup/2-install-eml-admintool'
          },
          {
            title: 'Set up NGINX',
            slug: 'eml-admintool/production-setup/set-up-nginx',
            file: '2-eml-admintool/2-production-setup/3-set-up-nginx'
          },
          {
            title: 'SSL certificate',
            slug: 'eml-admintool/production-setup/ssl-certificate',
            file: '2-eml-admintool/2-production-setup/4-ssl-certificate'
          },
          {
            title: 'Security hardening',
            slug: 'eml-admintool/production-setup/security-hardening',
            file: '2-eml-admintool/2-production-setup/5-security-hardening'
          }
        ]
      },
      {
        type: 'group',
        title: 'Development setup',
        items: [
          {
            title: 'Install Docker Desktop',
            slug: 'eml-admintool/development-setup/install-docker-desktop',
            file: '2-eml-admintool/3-development-setup/1-install-docker-desktop'
          },
          {
            title: 'Install EML AdminTool (dev)',
            slug: 'eml-admintool/development-setup/install-eml-admintool-dev',
            file: '2-eml-admintool/3-development-setup/2-install-eml-admintool-dev'
          }
        ]
      },
      {
        type: 'group',
        title: 'Administration and features',
        items: [
          {
            title: 'General settings',
            slug: 'eml-admintool/administration-and-features/general-settings',
            file: '2-eml-admintool/4-administration-and-features/1-general-settings'
          },
          {
            title: 'Profiles',
            slug: 'eml-admintool/administration-and-features/profiles',
            file: '2-eml-admintool/4-administration-and-features/2-profiles'
          },
          {
            title: 'Files Updater',
            slug: 'eml-admintool/administration-and-features/files-updater',
            file: '2-eml-admintool/4-administration-and-features/3-files-updater'
          },
          {
            title: 'Bootstraps',
            slug: 'eml-admintool/administration-and-features/bootstraps',
            file: '2-eml-admintool/4-administration-and-features/4-bootstraps'
          },
          {
            title: 'Maintenance',
            slug: 'eml-admintool/administration-and-features/maintenance',
            file: '2-eml-admintool/4-administration-and-features/5-maintenance'
          },
          {
            title: 'News',
            slug: 'eml-admintool/administration-and-features/news',
            file: '2-eml-admintool/4-administration-and-features/6-news'
          },
          {
            title: 'Backgrounds',
            slug: 'eml-admintool/administration-and-features/backgrounds',
            file: '2-eml-admintool/4-administration-and-features/7-backgrounds'
          },
          {
            title: 'Stats',
            slug: 'eml-admintool/administration-and-features/stats',
            file: '2-eml-admintool/4-administration-and-features/8-stats'
          },
          {
            title: 'Crash Reports',
            slug: 'eml-admintool/administration-and-features/crash-reports',
            file: '2-eml-admintool/4-administration-and-features/9-crash-reports'
          },
          {
            title: 'Account settings',
            slug: 'eml-admintool/administration-and-features/account-settings',
            file: '2-eml-admintool/4-administration-and-features/10-account-settings'
          }
        ]
      },
      {
        type: 'page',
        title: 'Uninstallation and reinstallation',
        slug: 'eml-admintool/uninstallation-and-reinstallation',
        file: '2-eml-admintool/5-uninstallation-and-reinstallation'
      }
    ]
  },
  {
    title: 'EML Lib and Launcher',
    entries: [
      {
        type: 'group',
        title: 'Getting started',
        items: [
          {
            title: 'Set up environment',
            slug: 'eml-lib-and-launcher/getting-started/set-up-environment',
            file: '3-eml-lib-and-launcher/1-getting-started/1-set-up-environment'
          },
          {
            title: 'Quick start',
            slug: 'eml-lib-and-launcher/getting-started/quick-start',
            file: '3-eml-lib-and-launcher/1-getting-started/2-quick-start'
          },
          {
            title: 'Frontend architecture',
            slug: 'eml-lib-and-launcher/getting-started/frontend-architecture',
            file: '3-eml-lib-and-launcher/1-getting-started/3-frontend-architecture'
          }
        ]
      },
      {
        type: 'group',
        title: 'API reference',
        items: [
          {
            title: 'MicrosoftAuth',
            slug: 'eml-lib-and-launcher/api-reference/microsoftauth',
            file: '3-eml-lib-and-launcher/2-api-reference/1-microsoftauth'
          },
          {
            title: 'YggdrasilAuth',
            slug: 'eml-lib-and-launcher/api-reference/yggdrasilauth',
            file: '3-eml-lib-and-launcher/2-api-reference/2-yggdrasilauth'
          },
          { title: 'AzAuth', slug: 'eml-lib-and-launcher/api-reference/azauth', file: '3-eml-lib-and-launcher/2-api-reference/3-azauth' },
          { title: 'CrackAuth', slug: 'eml-lib-and-launcher/api-reference/crackauth', file: '3-eml-lib-and-launcher/2-api-reference/4-crackauth' },
          { title: 'Profiles', slug: 'eml-lib-and-launcher/api-reference/profiles', file: '3-eml-lib-and-launcher/2-api-reference/5-profiles' },
          { title: 'Launcher', slug: 'eml-lib-and-launcher/api-reference/launcher', file: '3-eml-lib-and-launcher/2-api-reference/6-launcher' },
          { title: 'Java', slug: 'eml-lib-and-launcher/api-reference/java', file: '3-eml-lib-and-launcher/2-api-reference/7-java' },
          { title: 'Skin', slug: 'eml-lib-and-launcher/api-reference/skin', file: '3-eml-lib-and-launcher/2-api-reference/8-skin' },
          { title: 'Bootstrap', slug: 'eml-lib-and-launcher/api-reference/bootstrap', file: '3-eml-lib-and-launcher/2-api-reference/9-bootstrap' },
          {
            title: 'Maintenance',
            slug: 'eml-lib-and-launcher/api-reference/maintenance',
            file: '3-eml-lib-and-launcher/2-api-reference/10-maintenance'
          },
          { title: 'News', slug: 'eml-lib-and-launcher/api-reference/news', file: '3-eml-lib-and-launcher/2-api-reference/11-news' },
          {
            title: 'Background',
            slug: 'eml-lib-and-launcher/api-reference/background',
            file: '3-eml-lib-and-launcher/2-api-reference/12-background'
          },
          {
            title: 'ServerStatus',
            slug: 'eml-lib-and-launcher/api-reference/serverstatus',
            file: '3-eml-lib-and-launcher/2-api-reference/13-serverstatus'
          },
          { title: 'Stats', slug: 'eml-lib-and-launcher/api-reference/stats', file: '3-eml-lib-and-launcher/2-api-reference/14-stats' },
          {
            title: 'CrashReports',
            slug: 'eml-lib-and-launcher/api-reference/crashreports',
            file: '3-eml-lib-and-launcher/2-api-reference/15-crashreports'
          }
        ]
      },
      {
        type: 'page',
        title: 'Packaging',
        slug: 'eml-lib-and-launcher/packaging',
        file: '3-eml-lib-and-launcher/3-packaging'
      }
    ]
  }
]

export function getFlatPages(): DocPage[] {
  return docsMenu.flatMap((section) =>
    section.entries.flatMap((entry) => (entry.type === 'page' ? [{ title: entry.title, slug: entry.slug, file: entry.file }] : entry.items))
  )
}

export function findFileBySlug(slug: string): string | null {
  for (const section of docsMenu) {
    for (const entry of section.entries) {
      if (entry.type === 'page' && entry.slug === slug) return entry.file
      if (entry.type === 'group') {
        const match = entry.items.find((item) => item.slug === slug)
        if (match) return match.file
      }
    }
  }
  return null
}

export function findSectionIndex(slug: string): number {
  return docsMenu.findIndex((section) =>
    section.entries.some((entry) => (entry.type === 'page' ? entry.slug === slug : entry.items.some((item) => item.slug === slug)))
  )
}
