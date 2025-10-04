import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
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

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  async config => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response) {
      const { status, data } = error.response as { status: number; data: any }

      // Handle 401 - Try to refresh token
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Wait for the ongoing refresh to complete
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
            })
            .catch(err => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken')

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          // Call refresh endpoint
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Accept-Language': i18n.language,
                'x-custom-lang': i18n.language,
              },
            }
          )

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data

          // Save new tokens
          await SecureStore.setItemAsync('accessToken', newAccessToken)
          await SecureStore.setItemAsync('refreshToken', newRefreshToken)

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken)
          isRefreshing = false

          // Retry the original request
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as Error, null)
          isRefreshing = false

          // Clear tokens and redirect to login
          await SecureStore.deleteItemAsync('accessToken')
          await SecureStore.deleteItemAsync('refreshToken')

          throw refreshError
        }
      }

      // Handle validation errors (400)
      if (status === 400 && Array.isArray(data.message)) {
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
