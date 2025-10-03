import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { SIZE_STYLES } from './BaseInput.styles';
import type { BaseInputProps } from './BaseInput.types';

const BaseInput = ({
  size = 'md',
  className = '',
  error,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}: BaseInputProps) => {
  const sizeStyle = SIZE_STYLES[size];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="w-full mb-4">
      <View className="relative">
        <TextInput
          className={`
            ${sizeStyle.container}
            ${sizeStyle.text}
            bg-gray-50 dark:bg-gray-800
            text-gray-900 dark:text-white
            ${error ? 'border-2 border-red-500' : ''}
            ${showPasswordToggle ? 'pr-12' : ''}
            ${className}
          `}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-4 top-0 bottom-0 justify-center"
          >
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium">
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
};

export default BaseInput;
