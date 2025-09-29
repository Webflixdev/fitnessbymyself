import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

export default function DetailsScreen() {
  return (
    <SafeAreaView className="bg-white h-full w-full">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className=" h-full w-full"
      >
        <View className="h-full w-full flex justify-around pt-20">
          <View className="flex items-center">
            <Text className="text-sky-400 font-bold tracking-wider text-5xl">
              Login
            </Text>
          </View>

          <View className="flex items-center mx-4">
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-4">
              <TextInput placeholder="Email" placeholderTextColor={'gray'} />
            </View>
            <View className="bg-black/5 p-5 rounded-2xl w-full mb-4">
              <TextInput
                placeholder="Password"
                placeholderTextColor={'gray'}
                secureTextEntry
              />
            </View>
            <View className="w-full">
              <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3">
                <Text className="text-xl font-bold text-white text-center">
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center">
              <Text>Don't have an account? </Text>
              <TouchableOpacity>
                <Text className="text-sky-600">SignUp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
