import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CreateUserDto } from '@shared/types/user.types'
import { useSession } from '@/context/ctx'
import BaseButton from '@/components/BaseButton'
import BaseInput from '@/components/BaseInput'
import BaseModalHeader from '@/components/BaseModalHeader'
import BaseKeyboardAvoidingView from '@/components/BaseKeyboardAvoidingView'
import { ROUTES } from '@/constants/routes'

export default function SignUpScreen() {
  const router = useRouter()
  const session = useSession()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError(t('signUp.allFieldsRequired'))
      return
    }
    setLoading(true)
    setError(null)

    const userData: CreateUserDto = {
      email,
      name,
      password,
    }

    try {
      await session.signUp(userData)
      await session.signIn(email, password)
      router.replace(ROUTES.HOME)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    router.dismissAll()
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <BaseModalHeader
        title={t('signUp.title')}
        onBackPress={handleClose}
      />

      <BaseKeyboardAvoidingView>
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-400 rounded-2xl items-center justify-center mb-6">
            <Text className="text-white text-3xl font-bold">F</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('signUp.whatsYourName')}
          </Text>
        </View>

        <View>
          <BaseInput
            placeholder={t('signUp.firstName')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <BaseInput
            placeholder={t('signUp.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <BaseInput
            placeholder={t('signUp.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error && (
          <Text className="text-red-500 text-sm text-center mt-4">{error}</Text>
        )}

        <BaseButton
          label={t('signUp.continue')}
          onPress={handleSignUp}
          loading={loading}
          variant="primary"
          className="mt-8"
        />

        <TouchableOpacity
          onPress={() => router.push(ROUTES.SIGN_IN)}
          className="mt-6"
        >
          <Text className="text-center text-gray-600 dark:text-gray-400">
            {t('signUp.alreadyHaveAccount')}{' '}
            <Text className="text-sky-400 font-semibold">{t('signUp.logIn')}</Text>
          </Text>
        </TouchableOpacity>
      </BaseKeyboardAvoidingView>
    </SafeAreaView>
  )
}
