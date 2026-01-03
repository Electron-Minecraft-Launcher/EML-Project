export const CODESWITCH_KEY = Symbol('codeswitch')

export interface CodeSwitchContext {
  register: (label: string) => void
  unregister: (label: string) => void
  active: { value: string | null } // null au début
  select: (label: string) => void
}
