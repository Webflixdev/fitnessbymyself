import type { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'social';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: ComponentProps<typeof Ionicons>['name'];
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export interface StyleConfig {
  container: string;
  text: string;
  spinner: string;
}

export interface SizeConfig {
  container: string;
  text: string;
  icon: number;
}
