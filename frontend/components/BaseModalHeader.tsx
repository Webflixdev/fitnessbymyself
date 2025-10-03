import React from 'react'
import { View, Text } from 'react-native'
import BaseButtonBack from './BaseButtonBack'

interface BaseModalHeaderProps {
  title: string
  backLabel?: string
  onBackPress?: () => void
}

const BaseModalHeader: React.FC<BaseModalHeaderProps> = ({
  title,
  backLabel = 'Close',
  onBackPress
}) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="w-12">
        <BaseButtonBack label={backLabel} onPress={onBackPress} />
      </View>
      <Text className="flex-1 text-center text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </Text>
      <View className="w-12" />
    </View>
  )
}

export default BaseModalHeader
