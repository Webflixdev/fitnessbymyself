import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme()

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
      activeOpacity={0.7}
    >
      <Ionicons
        name={colorScheme === 'dark' ? 'sunny' : 'moon'}
        size={20}
        color="#6B7280"
      />
    </TouchableOpacity>
  )
}
