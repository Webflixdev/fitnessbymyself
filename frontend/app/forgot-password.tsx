import { useState } from 'react'
import { View, Text, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import BaseButton from '@/components/BaseButton'
import BaseInput from '@/components/BaseInput'
import BaseModalHeader from '@/components/BaseModalHeader'
import BaseKeyboardAvoidingView from '@/components/BaseKeyboardAvoidingView'
import BaseLogo from '@/components/BaseLogo'
import { ROUTES } from '@/constants/routes'
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '@/services/authService'
import { useSession } from '@/context/ctx'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const session = useSession()
  const { t } = useTranslation()
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestCode = async () => {
    if (!email) {
      setError(t('forgotPassword.emailRequired'))
      return
    }
    setLoading(true)
    setError(null)

    try {
      await forgotPassword(email)

      Alert.prompt(
        t('forgotPassword.enterCode'),
        t('forgotPassword.codeSent'),
        [
          {
            text: t('forgotPassword.cancel'),
            style: 'cancel',
          },
          {
            text: t('forgotPassword.submit'),
            onPress: async (inputCode?: string) => {
              if (inputCode && inputCode.length > 0) {
                await handleVerifyCode(inputCode)
              }
            },
          },
        ],
        'plain-text',
        '',
        'numeric'
      )
    } catch (err: any) {
      setError(err.message || t('forgotPassword.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (inputCode: string) => {
    setLoading(true)

    try {
      await verifyResetCode(email, inputCode)
      setCode(inputCode)
      setStep('password')
    } catch (err: any) {
      Alert.alert(
        t('common.error'),
        err.response?.data?.message || t('forgotPassword.invalidCode')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError(t('forgotPassword.allFieldsRequired'))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('forgotPassword.passwordsDoNotMatch'))
      return
    }

    if (newPassword.length < 8) {
      setError(t('forgotPassword.passwordTooShort'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      await resetPassword(email, code, newPassword)
      await session.signIn(email, newPassword)
      Alert.alert(
        t('common.success'),
        t('forgotPassword.passwordResetSuccess'),
        [{ text: 'OK', onPress: () => router.replace(ROUTES.HOME.path) }]
      )
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          t('forgotPassword.invalidCode')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'password') {
      setStep('email')
      setError(null)
      setCode('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      router.back()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <BaseModalHeader
        title={t('forgotPassword.title')}
        backLabel={t('forgotPassword.back')}
        onBackPress={handleBack}
      />

      <BaseKeyboardAvoidingView>
        <View className="items-center mb-8">
          <BaseLogo className="mb-6" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {step === 'email'
              ? t('forgotPassword.whatsYourEmail')
              : t('forgotPassword.newPassword')}
          </Text>
        </View>

        {step === 'email' ? (
          <>
            <BaseInput
              placeholder={t('forgotPassword.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error || undefined}
            />

            <BaseButton
              label={t('forgotPassword.submit')}
              onPress={handleRequestCode}
              loading={loading}
              variant="primary"
              className="mt-8"
            />
          </>
        ) : (
          <>
            <BaseInput
              placeholder={t('forgotPassword.newPassword')}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              showPasswordToggle
              textContentType="oneTimeCode"
            />

            <BaseInput
              placeholder={t('forgotPassword.confirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              textContentType="oneTimeCode"
              error={error || undefined}
            />

            <BaseButton
              label={t('forgotPassword.resetPassword')}
              onPress={handleResetPassword}
              loading={loading}
              variant="primary"
              className="mt-8"
            />
          </>
        )}
      </BaseKeyboardAvoidingView>
    </SafeAreaView>
  )
}
