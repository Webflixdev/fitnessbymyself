import type { InputSize, SizeConfig } from './BaseInput.types'

export const SIZE_STYLES: Record<InputSize, SizeConfig> = {
  sm: {
    container: 'px-4 h-10 rounded-lg',
    text: 'text-sm',
  },
  md: {
    container: 'px-6 h-12 rounded-xl',
    text: 'text-base',
  },
  lg: {
    container: 'px-8 h-14 rounded-xl',
    text: 'text-lg',
  },
}
