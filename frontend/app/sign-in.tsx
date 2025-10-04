import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/context/ctx'
import BaseButton from '@/components/BaseButton'
import BaseInput from '@/components/BaseInput'
import BaseModalHeader from '@/components/BaseModalHeader'
import BaseKeyboardAvoidingView from '@/components/BaseKeyboardAvoidingView'
import BaseLogo from '@/components/BaseLogo'
import { ROUTES } from '@/constants/routes'

export default function SignInScreen() {
  const router = useRouter()
  const session = useSession()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    if (!email || !password) {
      setError(t('signIn.emailRequired'))
      return
    }
    setLoading(true)
    setError(null)

    try {
      await session.signIn(email, password)
      router.replace(ROUTES.HOME.path)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    router.dismissAll()
  }

  const updateEmail = (email: string) => {
    setError(null)
    setEmail(email)
  }

  const updatePassword = (password: string) => {
    setError(null)
    setPassword(password)
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <BaseModalHeader title={t('signIn.title')} onBackPress={handleClose} />

      <BaseKeyboardAvoidingView>
        <View className="items-center mb-8">
          <BaseLogo className="mb-6" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('signIn.welcomeBack')}
          </Text>
        </View>

        <View>
          <BaseInput
            placeholder={t('signIn.email')}
            value={email}
            onChangeText={updateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <BaseInput
            placeholder={t('signIn.password')}
            value={password}
            onChangeText={updatePassword}
            secureTextEntry
            showPasswordToggle
          />
        </View>

        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push(ROUTES.FORGOT_PASSWORD.path)}
        >
          <Text className="text-sky-400 text-sm">
            {t('signIn.forgotPassword')}
          </Text>
        </TouchableOpacity>

        {error && (
          <Text className="text-red-500 text-sm text-center mt-4">{error}</Text>
        )}

        <BaseButton
          label={t('signIn.continue')}
          onPress={handleSignIn}
          loading={loading}
          variant="primary"
          className="mt-8"
        />

        <TouchableOpacity
          onPress={() => router.push(ROUTES.SIGN_UP.path)}
          className="mt-6"
        >
          <Text className="text-center text-gray-600 dark:text-gray-400">
            {t('signIn.dontHaveAccount')}{' '}
            <Text className="text-sky-400 font-semibold">
              {t('signIn.signUp')}
            </Text>
          </Text>
        </TouchableOpacity>
      </BaseKeyboardAvoidingView>
    </SafeAreaView>
  )
}
