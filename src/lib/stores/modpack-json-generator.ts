import { writable, derived } from 'svelte/store'

export interface ModpackFile {
  name: string
  path: string
  size: number
  sha1: string
  url: string
  type: 'MOD' | 'FOLDER' | 'OTHER'
}

export const modpackStore = writable({
  baseUrl: '',
  files: [] as ModpackFile[],
  isProcessing: false
})

export const generatedModpack = derived(modpackStore, ($s) => {
  return {
    files: $s.files
  }
})
