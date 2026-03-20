import { StatusBar } from 'react-native';
import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/authContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle={'light-content'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(authenticated)" />
      </Stack>
      <Toast autoHide={true} position="top" visibilityTime={3000} />
    </AuthProvider>
  );
}
