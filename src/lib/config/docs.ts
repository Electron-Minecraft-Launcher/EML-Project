export const DEFAULT_VERSION = 'v2'
export const AVAILABLE_VERSIONS = ['v2'] as const
export type DocVersion = (typeof AVAILABLE_VERSIONS)[number]

export type DocPage = {
  title: string
  slug: string
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

export const docsMenu: Record<DocVersion, DocSection[]> = {
  v2: [
    {
      title: 'Introduction',
      entries: [
        {
          type: 'page',
          title: 'What is EML?',
          slug: 'introduction/what-is-eml'
        },
        {
          type: 'page',
          title: 'Required knowledge',
          slug: 'introduction/required-knowledge'
        }
      ]
    },
    {
      title: 'EML AdminTool',
      entries: [
        {
          type: 'page',
          title: 'System requirements',
          slug: 'eml-admintool/system-requirements'
        },
        {
          type: 'group',
          title: 'Production setup',
          items: [
            {
              title: 'Install Docker',
              slug: 'eml-admintool/production-setup/install-docker'
            },
            {
              title: 'Install EML AdminTool',
              slug: 'eml-admintool/production-setup/install-eml-admintool'
            },
            {
              title: 'Set up NGINX',
              slug: 'eml-admintool/production-setup/set-up-nginx'
            },
            {
              title: 'SSL certificate',
              slug: 'eml-admintool/production-setup/ssl-certificate'
            },
            {
              title: 'Security hardening',
              slug: 'eml-admintool/production-setup/security-hardening'
            }
          ]
        },
        {
          type: 'group',
          title: 'Development setup',
          items: [
            {
              title: 'Install Docker Desktop',
              slug: 'eml-admintool/development-setup/install-docker-desktop'
            },
            {
              title: 'Install EML AdminTool (dev)',
              slug: 'eml-admintool/development-setup/install-eml-admintool-dev'
            }
          ]
        },
        {
          type: 'group',
          title: 'Administration and features',
          items: [
            {
              title: 'General settings',
              slug: 'eml-admintool/administration-and-features/general-settings'
            },
            {
              title: 'Profiles',
              slug: 'eml-admintool/administration-and-features/profiles'
            },
            {
              title: 'Files Updater',
              slug: 'eml-admintool/administration-and-features/files-updater'
            },
            {
              title: 'Bootstraps',
              slug: 'eml-admintool/administration-and-features/bootstraps'
            },
            {
              title: 'Maintenance',
              slug: 'eml-admintool/administration-and-features/maintenance'
            },
            {
              title: 'News',
              slug: 'eml-admintool/administration-and-features/news'
            },
            {
              title: 'Backgrounds',
              slug: 'eml-admintool/administration-and-features/backgrounds'
            },
            {
              title: 'Stats',
              slug: 'eml-admintool/administration-and-features/stats'
            },
            {
              title: 'Crash Reports',
              slug: 'eml-admintool/administration-and-features/crash-reports'
            },
            {
              title: 'Account settings',
              slug: 'eml-admintool/administration-and-features/account-settings'
            }
          ]
        },
        {
          type: 'page',
          title: 'Uninstallation and reinstallation',
          slug: 'eml-admintool/uninstallation-and-reinstallation'
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
              slug: 'eml-lib-and-launcher/getting-started/set-up-environment'
            },
            {
              title: 'Quick start',
              slug: 'eml-lib-and-launcher/getting-started/quick-start'
            },
            {
              title: 'Frontend architecture',
              slug: 'eml-lib-and-launcher/getting-started/frontend-architecture'
            }
          ]
        },
        {
          type: 'group',
          title: 'API reference',
          items: [
            {
              title: 'MicrosoftAuth',
              slug: 'eml-lib-and-launcher/api-reference/microsoftauth'
            },
            {
              title: 'YggdrasilAuth',
              slug: 'eml-lib-and-launcher/api-reference/yggdrasilauth'
            },
            { title: 'AzAuth', slug: 'eml-lib-and-launcher/api-reference/azauth' },
            { title: 'CrackAuth', slug: 'eml-lib-and-launcher/api-reference/crackauth' },
            { title: 'Profile', slug: 'eml-lib-and-launcher/api-reference/profile' },
            { title: 'Launcher', slug: 'eml-lib-and-launcher/api-reference/launcher' },
            { title: 'Java', slug: 'eml-lib-and-launcher/api-reference/java' },
            { title: 'Skin', slug: 'eml-lib-and-launcher/api-reference/skin' },
            { title: 'Bootstrap', slug: 'eml-lib-and-launcher/api-reference/bootstrap' },

            {
              title: 'Maintenance',
              slug: 'eml-lib-and-launcher/api-reference/maintenance'
            },
            { title: 'News', slug: 'eml-lib-and-launcher/api-reference/news' },
            {
              title: 'Background',
              slug: 'eml-lib-and-launcher/api-reference/background'
            },
            {
              title: 'ServerStatus',
              slug: 'eml-lib-and-launcher/api-reference/serverstatus'
            },
            { title: 'Stats', slug: 'eml-lib-and-launcher/api-reference/stats' },
            {
              title: 'CrashReports',
              slug: 'eml-lib-and-launcher/api-reference/crashreports'
            }
          ]
        },
        {
          type: 'page',
          title: 'Packaging',
          slug: 'eml-lib-and-launcher/packaging'
        }
      ]
    }
  ]
}

export function getFlatPages(version: DocVersion = DEFAULT_VERSION): DocPage[] {
  const pages: DocPage[] = []
  const menu = docsMenu[version] ?? docsMenu[DEFAULT_VERSION]

  menu.forEach((section) => {
    section.entries.forEach((entry) => {
      if (entry.type === 'page') {
        pages.push({ slug: entry.slug, title: entry.title })
      } else {
        entry.items.forEach((item) => {
          pages.push({ slug: item.slug, title: item.title })
        })
      }
    })
  })
  return pages
}

export function findFileBySlug(slug: string, version: DocVersion = DEFAULT_VERSION): string | null {
  const map: Record<DocVersion, Record<string, string>> = {
    v2: {
      '': 'index',
      'introduction/what-is-eml': '1-introduction/1-what-is-eml',
      'introduction/required-knowledge': '1-introduction/2-required-knowledge',
      'eml-admintool/system-requirements': '2-eml-admintool/1-system-requirements',
      'eml-admintool/production-setup/install-docker': '2-eml-admintool/2-production-setup/1-install-docker',
      'eml-admintool/production-setup/install-eml-admintool': '2-eml-admintool/2-production-setup/2-install-eml-admintool',
      'eml-admintool/production-setup/set-up-nginx': '2-eml-admintool/2-production-setup/3-set-up-nginx',
      'eml-admintool/production-setup/ssl-certificate': '2-eml-admintool/2-production-setup/4-ssl-certificate',
      'eml-admintool/production-setup/security-hardening': '2-eml-admintool/2-production-setup/5-security-hardening',
      'eml-admintool/development-setup/install-docker-desktop': '2-eml-admintool/3-development-setup/1-install-docker-desktop',
      'eml-admintool/development-setup/install-eml-admintool-dev': '2-eml-admintool/3-development-setup/2-install-eml-admintool-dev',
      'eml-admintool/administration-and-features/general-settings': '2-eml-admintool/4-administration-and-features/1-general-settings',
      'eml-admintool/administration-and-features/profiles': '2-eml-admintool/4-administration-and-features/2-profiles',
      'eml-admintool/administration-and-features/files-updater': '2-eml-admintool/4-administration-and-features/3-files-updater',
      'eml-admintool/administration-and-features/bootstraps': '2-eml-admintool/4-administration-and-features/4-bootstraps',
      'eml-admintool/administration-and-features/maintenance': '2-eml-admintool/4-administration-and-features/5-maintenance',
      'eml-admintool/administration-and-features/news': '2-eml-admintool/4-administration-and-features/6-news',
      'eml-admintool/administration-and-features/backgrounds': '2-eml-admintool/4-administration-and-features/7-backgrounds',
      'eml-admintool/administration-and-features/stats': '2-eml-admintool/4-administration-and-features/8-stats',
      'eml-admintool/administration-and-features/crash-reports': '2-eml-admintool/4-administration-and-features/9-crash-reports',
      'eml-admintool/administration-and-features/account-settings': '2-eml-admintool/4-administration-and-features/10-account-settings',
      'eml-admintool/uninstallation-and-reinstallation': '2-eml-admintool/5-uninstallation-and-reinstallation',
      'eml-lib-and-launcher/getting-started/set-up-environment': '3-eml-lib-and-launcher/1-getting-started/1-set-up-environment',
      'eml-lib-and-launcher/getting-started/quick-start': '3-eml-lib-and-launcher/1-getting-started/2-quick-start',
      'eml-lib-and-launcher/getting-started/frontend-architecture': '3-eml-lib-and-launcher/1-getting-started/3-frontend-architecture',
      'eml-lib-and-launcher/api-reference/microsoftauth': '3-eml-lib-and-launcher/2-api-reference/1-microsoftauth',
      'eml-lib-and-launcher/api-reference/yggdrasilauth': '3-eml-lib-and-launcher/2-api-reference/2-yggdrasilauth',
      'eml-lib-and-launcher/api-reference/azauth': '3-eml-lib-and-launcher/2-api-reference/3-azauth',
      'eml-lib-and-launcher/api-reference/crackauth': '3-eml-lib-and-launcher/2-api-reference/4-crackauth',
      'eml-lib-and-launcher/api-reference/profile': '3-eml-lib-and-launcher/2-api-reference/5-profile',
      'eml-lib-and-launcher/api-reference/launcher': '3-eml-lib-and-launcher/2-api-reference/6-launcher',
      'eml-lib-and-launcher/api-reference/java': '3-eml-lib-and-launcher/2-api-reference/7-java',
      'eml-lib-and-launcher/api-reference/skin': '3-eml-lib-and-launcher/2-api-reference/8-skin',
      'eml-lib-and-launcher/api-reference/bootstrap': '3-eml-lib-and-launcher/2-api-reference/9-bootstrap',
      'eml-lib-and-launcher/api-reference/maintenance': '3-eml-lib-and-launcher/2-api-reference/10-maintenance',
      'eml-lib-and-launcher/api-reference/news': '3-eml-lib-and-launcher/2-api-reference/11-news',
      'eml-lib-and-launcher/api-reference/background': '3-eml-lib-and-launcher/2-api-reference/12-background',
      'eml-lib-and-launcher/api-reference/serverstatus': '3-eml-lib-and-launcher/2-api-reference/13-serverstatus',
      'eml-lib-and-launcher/api-reference/stats': '3-eml-lib-and-launcher/2-api-reference/14-stats',
      'eml-lib-and-launcher/api-reference/crashreports': '3-eml-lib-and-launcher/2-api-reference/15-crashreports',
      'eml-lib-and-launcher/packaging': '3-eml-lib-and-launcher/3-packaging'
    }
  }

  return map[version]?.[slug] ?? null
}

