import { useState } from 'react'
import { View, TouchableOpacity, Text, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { Language } from '@shared/enums/language.enum'

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: Language.EN, name: 'English', flag: '🇺🇸' },
  { code: Language.ES, name: 'Español', flag: '🇪🇸' },
]

export default function LanguageSelector() {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage } = useLanguage()
  const [modalVisible, setModalVisible] = useState(false)

  const handleLanguageSelect = (lang: Language) => {
    changeLanguage(lang)
    setModalVisible(false)
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
        activeOpacity={0.7}
      >
        <Ionicons name="language" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <View
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 m-4 w-64"
            onStartShouldSetResponder={() => true}
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {t('common.selectLanguage')}
            </Text>

            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                className={`flex-row items-center p-3 rounded-xl mb-2 ${
                  currentLanguage === lang.code
                    ? 'bg-sky-400'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
                activeOpacity={0.7}
              >
                <Text className="text-2xl mr-3">{lang.flag}</Text>
                <Text
                  className={`flex-1 text-base ${
                    currentLanguage === lang.code
                      ? 'text-white font-semibold'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}
