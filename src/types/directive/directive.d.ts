import type {
  AuthDirective,
  HighlightDirective,
  RippleDirective,
  RolesDirective,
} from '@/directives'

declare module 'vue' {
  export type GlobalDirectives = {
    vAuth: AuthDirective
    vRoles: RolesDirective
    vRipple: RippleDirective
    vHighlight: HighlightDirective
  }
}
