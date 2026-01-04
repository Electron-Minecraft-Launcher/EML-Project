export const TABS_KEY = Symbol('tabs')

export interface TabContext {
  register: (label: string) => void
  unregister: (label: string) => void
  active: { value: string | null } // null au début
  select: (label: string) => void
}
