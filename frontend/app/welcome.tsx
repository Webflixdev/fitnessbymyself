import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import BaseButton from '../components/BaseButton/BaseButton'
import LanguageSelector from '../components/LanguageSelector'
import ThemeToggle from '../components/ThemeToggle'
import BaseLogo from '../components/BaseLogo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ROUTES } from '../constants/routes'

const WelcomeScreen = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleSignUp = () => {
    router.push(ROUTES.SIGN_UP.path)
  }

  const handleLogin = () => {
    router.push(ROUTES.SIGN_IN.path)
  }

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In')
  }

  const handleAppleSignIn = () => {
    console.log('Apple Sign-In')
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 justify-between">
      <View className="flex-row justify-between items-center mb-4">
        <ThemeToggle />
        <LanguageSelector />
      </View>

      <View className="flex-1 justify-end items-center">
        <BaseLogo size="small" className="mb-10" />

        <Text className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          {t('welcome.title')}
        </Text>

        <BaseButton
          label={t('welcome.signUpFree')}
          onPress={handleSignUp}
          variant="primary"
          className="mb-4"
        />

        <BaseButton
          label={t('welcome.continueWithGoogle')}
          onPress={handleGoogleSignIn}
          variant="social"
          iconName="logo-google"
          className="mb-4"
        />

        <BaseButton
          label={t('welcome.continueWithApple')}
          onPress={handleAppleSignIn}
          variant="social"
          iconName="logo-apple"
        />
      </View>

      <TouchableOpacity onPress={handleLogin} className="py-4">
        <Text className="text-sky-400 text-center text-lg font-semibold">
          {t('welcome.logIn')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default WelcomeScreen
