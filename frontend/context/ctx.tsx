import { use, createContext, type PropsWithChildren } from 'react'
import { signIn, signUp, signOut } from '@/services/authService'
import { useStorageState } from './useStorageState'
import * as SecureStore from 'expo-secure-store'
import type { CreateUserDto } from '@shared/types/user.types'

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: CreateUserDto) => Promise<void>
  signOut: () => Promise<void>
  session?: string | null
  isLoading: boolean
}>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
})

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext)
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />')
  }

  return value
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('accessToken')

  const logginUser = async (email: string, password: string) => {
    const { accessToken, refreshToken } = await signIn(email, password)
    // Save both tokens
    await SecureStore.setItemAsync('accessToken', accessToken)
    await SecureStore.setItemAsync('refreshToken', refreshToken)
    setSession(accessToken)
  }

  const registerUser = async (userData: CreateUserDto) => {
    const { accessToken, refreshToken } = await signUp(userData)
    // Save both tokens
    await SecureStore.setItemAsync('accessToken', accessToken)
    await SecureStore.setItemAsync('refreshToken', refreshToken)
    setSession(accessToken)
  }

  return (
    <AuthContext
      value={{
        signIn: async (email: string, password: string) => {
          await logginUser(email, password)
        },
        signUp: async (userData: CreateUserDto) => {
          await registerUser(userData)
        },
        signOut: async () => {
          await signOut()
          await SecureStore.deleteItemAsync('accessToken')
          await SecureStore.deleteItemAsync('refreshToken')
          setSession(null)
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  )
}
