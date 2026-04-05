import { writable, derived } from 'svelte/store'

export const generatorStore = writable({
  url: '',
  step: 1,
  useAdminTool: true,
  useProfiles: true,
  slug: '',
  root: '',
  storage: 'isolated',
  minecraftVersion: '',
  loaderType: 'vanilla',
  loaderVersion: '',
  modpackUrl: '',
  gameArgs: [] as string[],
  cleaningEnabled: true,
  cleaningIgnored: ['crash-reports/', 'logs/', 'resourcepacks/', 'resources/', 'saves/', 'shaderpacks/', 'options.txt', 'optionsof.txt'],
  javaInstall: 'auto',
  javaPathType: 'absolute',
  javaAbsolutePath: '',
  javaRelativePath: '',
  javaArgs: [] as string[]
})

export const generatedConfig = derived(generatorStore, ($s) => {
  const config: any = {
    root: $s.root,
    account: '/* Authenticated Account object */' as any
  }

  if ($s.useProfiles) {
    config.storage = $s.storage
    config.profile = { slug: '', minecraft: {} as any } as any

    if (!$s.useAdminTool) {
      config.profile.slug = $s.slug ?? ''
      config.profile.minecraft = {
        version: $s.minecraftVersion || 'latest_release',
        loader: {
          loader: $s.loaderType || 'vanilla',
          version: $s.loaderType !== 'vanilla' ? $s.loaderVersion : undefined
        },
        modpackUrl: $s.modpackUrl || undefined,
        args: $s.gameArgs.length ? $s.gameArgs : undefined
      }
    } else {
      config.profile = '/* Manage with Profile.getProfiles() */' as any
      config.minecraft = $s.gameArgs.length ? { args: $s.gameArgs } : undefined
      config.url = $s.url
    }
  } else {
    if (!$s.useAdminTool) {
      config.minecraft = {
        version: $s.minecraftVersion || 'latest_release',
        loader: {
          loader: $s.loaderType,
          version: $s.loaderType !== 'vanilla' ? $s.loaderVersion : undefined
        },
        modpackUrl: $s.modpackUrl || undefined,
        args: $s.gameArgs.length ? $s.gameArgs : undefined
      }
    } else {
      config.minecraft = $s.gameArgs.length ? { args: $s.gameArgs } : undefined
      config.url = $s.url
    }
  }

  config.cleaning = {
    enabled: $s.useProfiles && $s.storage === 'shared' ? false : $s.cleaningEnabled,
    ignored: (($s.useProfiles && $s.storage === 'isolated') || !$s.useProfiles) && $s.cleaningEnabled ? $s.cleaningIgnored : undefined
  }

  config.java = {
    install: $s.javaInstall,
    absolutePath: $s.javaInstall === 'manual' && $s.javaPathType === 'absolute' ? ($s.javaAbsolutePath ?? '') : undefined,
    relativePath: $s.javaInstall === 'manual' && $s.javaPathType === 'relative' ? ($s.javaRelativePath ?? '') : undefined,
    args: $s.javaArgs.length ? $s.javaArgs : undefined
  }

  return config
})

