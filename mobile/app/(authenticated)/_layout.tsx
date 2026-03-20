import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/authContext';
import { useEffect } from 'react';

export default function AuthenticatedLayout() {
  const { loadingAuth, signed } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loadingAuth && !signed) {
      router.replace('/login');
    }
  }, [loadingAuth, signed]);
  if (loadingAuth || !signed) {
    return null;
  }
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
      </Stack>
    </>
  );
}
