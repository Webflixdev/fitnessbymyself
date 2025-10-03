export const ROUTES = {
  WELCOME: '/welcome',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  HOME: '/',
} as const

export type Route = typeof ROUTES[keyof typeof ROUTES]
