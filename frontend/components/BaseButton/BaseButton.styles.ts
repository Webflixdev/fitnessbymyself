import type { ButtonVariant, ButtonSize, StyleConfig, SizeConfig } from './BaseButton.types';

export const VARIANT_STYLES: Record<ButtonVariant, StyleConfig> = {
  primary: {
    container: 'bg-sky-400 dark:bg-sky-600 active:bg-sky-500 dark:active:bg-sky-700',
    text: 'text-white',
    spinner: '#FFFFFF',
  },
  secondary: {
    container: 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 active:bg-gray-300 dark:active:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    spinner: '#374151',
  },
  outlined: {
    container: 'bg-transparent border-2 border-sky-400 dark:border-sky-600 active:bg-sky-50 dark:active:bg-sky-950',
    text: 'text-sky-400 dark:text-sky-400',
    spinner: '#38BDF8',
  },
  social: {
    container: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-900',
    text: 'text-gray-800 dark:text-white',
    spinner: '#1F2937',
  },
};

export const SIZE_STYLES: Record<ButtonSize, SizeConfig> = {
  sm: {
    container: 'px-4 py-2 rounded-lg',
    text: 'text-sm font-medium',
    icon: 16,
  },
  md: {
    container: 'px-6 py-5 rounded-xl',
    text: 'text-base font-semibold',
    icon: 20,
  },
  lg: {
    container: 'px-8 py-6 rounded-xl',
    text: 'text-lg font-bold',
    icon: 24,
  },
};
