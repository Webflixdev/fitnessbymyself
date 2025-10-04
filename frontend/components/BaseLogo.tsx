import { View, Text } from 'react-native'

interface BaseLogoProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function BaseLogo({
  size = 'medium',
  className,
}: BaseLogoProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  }

  const textSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
  }

  return (
    <View
      className={`${sizeClasses[size]} bg-sky-400 rounded-2xl items-center justify-center ${className || ''}`}
    >
      <Text className={`text-white ${textSizes[size]} font-bold`}>F</Text>
    </View>
  )
}
