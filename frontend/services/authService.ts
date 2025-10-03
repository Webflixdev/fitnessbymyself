import { CreateUserDto } from '@shared/types/user.types'
import api from './api'

export const signIn = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password })
  return response.data
}

export const signUp = async (userData: CreateUserDto) => {
  const response = await api.post('/auth/signup', userData)
  return response.data
}

export const signOut = async () => {
  const response = await api.post('/auth/logout')
  return response.data
}

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email })
  return response.data
}

export const verifyResetCode = async (email: string, code: string) => {
  const response = await api.post('/auth/verify-reset-code', { email, code })
  return response.data
}

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', { email, code, newPassword })
  return response.data
}

const authService = {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  verifyResetCode,
  resetPassword,
}

export default authService
