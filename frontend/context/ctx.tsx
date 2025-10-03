import { use, createContext, type PropsWithChildren } from 'react'
import { signIn, signUp, signOut } from '@/services/authService'
import { useStorageState } from './useStorageState'
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
  const [[isLoading, session], setSession] = useStorageState('session')
  const logginUser = async (email: string, password: string) => {
    const { accessToken } = await signIn(email, password)
    setSession(accessToken)
  }
  return (
    <AuthContext
      value={{
        signIn: async (email: string, password: string) => {
          await logginUser(email, password)
        },
        signUp: async (userData: CreateUserDto) => {
          await signUp(userData)
        },
        signOut: async () => {
          await signOut()
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
