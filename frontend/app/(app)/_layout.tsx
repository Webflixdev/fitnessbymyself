import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>Home</Label>
          <Icon sf="house.fill" drawable="custom_android_drawable" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf="gear" drawable="custom_settings_drawable" />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </SafeAreaProvider>
  )
}
