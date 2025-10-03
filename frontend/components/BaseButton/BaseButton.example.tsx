/**
 * BaseButton Usage Examples
 *
 * This file shows how to use the BaseButton component in different scenarios.
 */

import React from 'react';
import { View } from 'react-native';
import BaseButton from './BaseButton';

export const ButtonExamples = () => {
  return (
    <View className="p-4 gap-4">
      {/* Basic buttons */}
      <BaseButton label="Primary Button" onPress={() => {}} />
      <BaseButton label="Secondary Button" onPress={() => {}} variant="secondary" />
      <BaseButton label="Outlined Button" onPress={() => {}} variant="outlined" />
      <BaseButton label="Social Button" onPress={() => {}} variant="social" />

      {/* Different sizes */}
      <BaseButton label="Small Button" onPress={() => {}} size="sm" />
      <BaseButton label="Medium Button" onPress={() => {}} size="md" />
      <BaseButton label="Large Button" onPress={() => {}} size="lg" />

      {/* With icons */}
      <BaseButton
        label="Continue"
        onPress={() => {}}
        iconName="arrow-forward"
        iconPosition="right"
      />
      <BaseButton
        label="Sign in with Google"
        onPress={() => {}}
        variant="social"
        iconName="logo-google"
        iconPosition="left"
      />

      {/* States */}
      <BaseButton label="Loading..." onPress={() => {}} loading />
      <BaseButton label="Disabled" onPress={() => {}} disabled />

      {/* Custom width */}
      <BaseButton label="Auto Width" onPress={() => {}} fullWidth={false} />
    </View>
  );
};
