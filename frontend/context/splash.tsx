import { SplashScreen } from 'expo-router'
import { useSession } from './ctx'
import { useEffect } from 'react'
SplashScreen.preventAutoHideAsync()

interface SplashScreenControllerProps {
  fontsLoaded: boolean
}

export function SplashScreenController({
  fontsLoaded,
}: SplashScreenControllerProps) {
  const { isLoading } = useSession()

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [isLoading, fontsLoaded])

  return null
}
