import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { VARIANT_STYLES, SIZE_STYLES } from './BaseButton.styles';
import type { BaseButtonProps } from './BaseButton.types';

const BaseButton: React.FC<BaseButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = true,
  className = '',
}) => {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${fullWidth ? 'w-full' : 'self-start'} ${className}`}
      activeOpacity={0.7}
    >
      <View
        pointerEvents="none"
        className={`
          ${sizeStyle.container}
          ${variantStyle.container}
          flex-row items-center justify-center
          ${isDisabled ? 'opacity-50' : ''}
        `}
      >
        {loading ? (
          <ActivityIndicator color={variantStyle.spinner} size="small" />
        ) : (
          <>
            {iconName && iconPosition === 'left' && (
              <Ionicons
                name={iconName}
                size={sizeStyle.icon}
                className={`${variantStyle.text} mr-2`}
              />
            )}
            <Text className={`${sizeStyle.text} ${variantStyle.text} text-center`}>
              {label}
            </Text>
            {iconName && iconPosition === 'right' && (
              <Ionicons
                name={iconName}
                size={sizeStyle.icon}
                className={`${variantStyle.text} ml-2`}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BaseButton;
