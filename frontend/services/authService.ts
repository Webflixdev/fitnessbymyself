import { CreateUserDto } from '@shared/types/user.types'

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`

export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error en el inicio de sesión')
    }
    return data
  } catch (error) {
    throw error
  }
}

export const signUp = async (userData: CreateUserDto) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar el usuario')
    }

    return data
  } catch (error) {
    throw error
  }
}

const authService = {
  signIn,
  signUp,
}

export default authService
