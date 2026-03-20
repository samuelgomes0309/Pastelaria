import { useAuth } from '@/contexts/authContext';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { loadingAuth, signed } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (loadingAuth) return;
    const isAuthGroup = segments[0] === '(authenticated)';
    if (!signed && isAuthGroup) {
      router.replace('/login');
    } else if (signed && !isAuthGroup) {
      router.replace('/(authenticated)/dashboard');
    }
  }, [loadingAuth, signed, segments]);
  if (loadingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-app-background">
        <ActivityIndicator size="large" color="#f6005d" />
      </View>
    );
  }
  return (
    <View className="flex-1 items-center justify-center bg-app-background">
      <ActivityIndicator size="large" color="#f6005d" />
    </View>
  );
}
