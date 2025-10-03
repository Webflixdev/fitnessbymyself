import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

interface BaseButtonBackProps {
  label?: string
  onPress?: () => void
}

const BaseButtonBack: React.FC<BaseButtonBackProps> = ({
  label = 'Close',
  onPress
}) => {
  const router = useRouter()

  const handleGoBack = () => {
    if (onPress) {
      onPress()
    } else {
      // Default behavior: go back
      if (router.canGoBack()) {
        router.back()
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={handleGoBack}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      style={styles.button}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <Ionicons name="chevron-back" size={20} color="#38BDF8" />
        <Text className="text-sky-400 text-base ml-1">{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
})

export default BaseButtonBack
