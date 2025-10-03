# i18n Configuration

Internationalization setup using **i18next** and **react-i18next**.

## Supported Languages

- 🇺🇸 English (en) - Default
- 🇪🇸 Spanish (es)

## Basic Usage

### In Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t('welcome.title')}</Text>;
}
```

### Change Language

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function Settings() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <Button
      onPress={() => changeLanguage('es')}
      label={currentLanguage === 'es' ? 'English' : 'Español'}
    />
  );
}
```

## File Structure

```
i18n/
├── config.ts           # i18next configuration
├── locales/
│   ├── en.json        # English translations
│   └── es.json        # Spanish translations
└── README.md          # This documentation
```

## Adding New Translations

1. Edit `locales/en.json` and `locales/es.json`
2. Use nested object structure:

```json
{
  "screen": {
    "key": "Translation"
  }
}
```

3. Use in your component:

```tsx
t('screen.key')
```

## Auto Detection

Language is automatically detected from the device's OS using `expo-localization`.

If the device language is not available, it falls back to **English**.
