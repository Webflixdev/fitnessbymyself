import type { TextInputProps } from 'react-native';

export type InputSize = 'sm' | 'md' | 'lg';

export interface BaseInputProps extends Omit<TextInputProps, 'style'> {
  size?: InputSize;
  className?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export interface SizeConfig {
  container: string;
  text: string;
}
