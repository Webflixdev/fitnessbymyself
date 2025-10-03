import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Language = 'en' | 'es'

const LANGUAGE_STORAGE_KEY = 'app_language'

export const useLanguage = () => {
  const { i18n } = useTranslation()

  const changeLanguage = async (lang: Language) => {
    try {
      await i18n.changeLanguage(lang)
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const currentLanguage = i18n.language as Language

  return {
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === 'en',
    isSpanish: currentLanguage === 'es',
  }
}
