import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'

import en from './locales/en.json'
import es from './locales/es.json'

const LANGUAGE_STORAGE_KEY = 'app_language'

const resources = {
  en: { translation: en },
  es: { translation: es },
}

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)

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
