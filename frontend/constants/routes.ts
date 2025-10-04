export const ROUTES = {
  WELCOME: { path: '/welcome', name: 'welcome' },
  SIGN_IN: { path: '/sign-in', name: 'sign-in' },
  SIGN_UP: { path: '/sign-up', name: 'sign-up' },
  FORGOT_PASSWORD: { path: '/forgot-password', name: 'forgot-password' },
  HOME: { path: '/', name: 'index' },
  PROFILE: { path: '/(app)/profile', name: 'profile' },
  SETTINGS: { path: '/(app)/profile/settings', name: 'settings' },
  WORKOUTS: { path: '/(app)/workouts', name: 'workouts' },
  WORKOUT_DETAIL: { path: '/(app)/workout/[id]', name: 'workout-detail' },
  EXERCISE_DETAIL: { path: '/(app)/exercise/[id]', name: 'exercise-detail' },
} as const

export type RouteInfo = (typeof ROUTES)[keyof typeof ROUTES]
export type RoutePath = RouteInfo['path']
export type RouteName = RouteInfo['name']
