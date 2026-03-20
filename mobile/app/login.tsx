import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, View } from 'react-native';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(authenticated)/dashboard');
    } catch {
      Alert.alert('Erro', 'Falha ao tentar fazer login');
    } finally {
      setLoading(false);
    }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#080c1a' }} behavior="padding">
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        <View className="flex w-full gap-4 px-4 py-2">
          <View>
            <Text className="text-center text-4xl font-bold italic text-white">
              Pastelaria<Text className="text-4xl text-brand-primary">SG</Text>
            </Text>
          </View>
          <Label className="text-lg font-bold text-white">Digite seu email</Label>
          <Input
            className="border border-gray-500 bg-app-surface-alt text-white"
            placeholder="ex: pizzaria@hotmail.com"
            placeholderTextColor={'#9ca3af'}
            value={email}
            onChangeText={setEmail}
          />
          <Label className="text-lg font-bold text-white">Digite sua senha</Label>
          <Input
            className="border border-gray-500 bg-app-surface-alt text-white"
            placeholder="********"
            placeholderTextColor={'#9ca3af'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            className="active:bg-brand-primary/85 bg-brand-primary text-white"
            disabled={loading}
            onPress={handleLogin}>
            {loading ? <ActivityIndicator color={'#FFF'} /> : <Text>Acessar</Text>}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
