import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import i18n from '../i18n/config'
import { Language } from '@shared/enums/language.enum'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use(
  async config => {
    try {
      const token = await SecureStore.getItemAsync('session')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      const currentLanguage = (i18n.language as Language) || Language.EN
      config.headers['Accept-Language'] = currentLanguage
      config.headers['x-custom-lang'] = currentLanguage

      return config
    } catch (error) {
      console.error('Error reading token:', error)
      return config
    }
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        console.log('Unauthorized - clearing session')
        await SecureStore.deleteItemAsync('session')
      }

      // Handle validation errors (400)
      if (status === 400 && Array.isArray(data.message)) {
        // NestJS validation errors come as an array
        const errorMessage = data.message[0]
        throw new Error(errorMessage)
      }

      throw new Error(data.message || `Error ${status}: ${error.message}`)
    } else if (error.request) {
      throw new Error(i18n.t('errors.noResponse'))
    } else {
      throw new Error(error.message || i18n.t('errors.unexpected'))
    }
  }
)

export default api
