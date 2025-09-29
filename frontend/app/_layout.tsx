import { SessionProvider, useSession } from '../context/ctx'
import { Stack, SplashScreen } from 'expo-router'
import { SplashScreenController } from '../context/splash'
import '../global.css'

export default function Root() {
  SplashScreen.preventAutoHideAsync()
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  )
}

function RootNavigator() {
  const { session } = useSession()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  )
}
