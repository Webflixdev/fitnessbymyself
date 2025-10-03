import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'

interface BaseKeyboardAvoidingViewProps {
  children: React.ReactNode
  className?: string
}

const BaseKeyboardAvoidingView: React.FC<BaseKeyboardAvoidingViewProps> = ({
  children,
  className = 'flex-1 justify-center px-8',
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={className}
    >
      {children}
    </KeyboardAvoidingView>
  )
}

export default BaseKeyboardAvoidingView
