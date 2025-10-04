import { useTranslation } from 'react-i18next'
import { storage, LANGUAGE_STORAGE_KEY } from '@/i18n/config'

export enum Language {
  EN = 'en',
  ES = 'es',
}

export type LanguageCode = `${Language}`

export const useLanguage = () => {
  const { i18n } = useTranslation()

  const changeLanguage = async (lang: Language) => {
    try {
      await i18n.changeLanguage(lang)
      await storage.setItem(LANGUAGE_STORAGE_KEY, lang)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const currentLanguage = i18n.language as Language

  return {
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === Language.EN,
    isSpanish: currentLanguage === Language.ES,
  }
}
