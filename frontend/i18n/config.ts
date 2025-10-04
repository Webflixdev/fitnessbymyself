import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

import en from './locales/en.json'
import es from './locales/es.json'

const LANGUAGE_STORAGE_KEY = 'app_language'

const resources = {
  en: { translation: en },
  es: { translation: es },
}

// Storage wrapper that works across platforms
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null // SSR
      return localStorage.getItem(key)
    }
    return AsyncStorage.getItem(key)
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return // SSR
      localStorage.setItem(key, value)
      return
    }
    return AsyncStorage.setItem(key, value)
  },
}

const initI18n = async () => {
  let savedLanguage = await storage.getItem(LANGUAGE_STORAGE_KEY)

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0]?.languageCode || 'en'
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  })
}

initI18n()

export default i18n
export { storage, LANGUAGE_STORAGE_KEY }
