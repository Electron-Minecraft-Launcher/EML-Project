import { writable } from 'svelte/store'

export type LoaderType = 'vanilla' | 'forge' | 'neoforge' | 'fabric' | 'quilt'

export const versionSelection = writable({
  loader: 'vanilla' as LoaderType,
  group: '1.21',
  mcVersion: '',
  loaderVersion: ''
})

