import { SessionProvider, useSession } from '../context/ctx'
import { Stack } from 'expo-router'
import { SplashScreenController } from '../context/splash'
import * as Font from 'expo-font'
import '../global.css'
import '../i18n/config'

export default function Root() {
  const [fontsLoaded] = Font.useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    FontAwesome: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
  })

  return (
    <SessionProvider>
      <SplashScreenController fontsLoaded={fontsLoaded} />
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
        <Stack.Screen name="welcome" />
        <Stack.Screen
          name="sign-in"
          options={{
            presentation: 'modal',
            gestureEnabled: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            presentation: 'modal',
            gestureEnabled: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            presentation: 'modal',
            gestureEnabled: true,
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  )
}
