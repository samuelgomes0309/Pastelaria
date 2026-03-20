import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/authContext';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const insets = useSafeAreaInsets();
  async function handleCreateTable() {
    if (!tableNumber.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o campo do numero da mesa.');
      return;
    }
    try {
      Keyboard.dismiss();
      setLoading(true);
      const table = parseInt(tableNumber);
      if (isNaN(table) || table <= 0) {
        Alert.alert('Atenção', 'Por favor, insira um número válido para a mesa.');
        return;
      }
      if (name && !isNaN(Number(name))) {
        Alert.alert('Atenção', 'Por favor, insira um nome válido para o cliente.');
        return;
      }
      const response = await api.post('/orders', { table: table, name: name });
      router.replace({
        pathname: '/(authenticated)/orders/[order_id]',
        params: { order_id: response.data.id },
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        Alert.alert('Erro', error.response?.data?.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <View className="flex-1 bg-app-background">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              position: 'absolute',
              top: insets.top + 20,
              right: 16,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              paddingInline: 16,
            }}>
            <Button className="max-w-20 bg-red-600 active:bg-red-600/75" onPress={signOut}>
              <Text className="text-white">Sair</Text>
            </Button>
          </View>
          <View className="flex w-full gap-3 px-4 py-2">
            <View>
              <Text className="text-center text-4xl font-bold italic text-white">
                Pastelaria<Text className="text-4xl text-brand-primary">SG</Text>
              </Text>
            </View>
            <Text className="text-center text-xl font-bold text-white">Novo Pedido</Text>
            <Input
              className="border border-gray-500 bg-app-surface-alt text-white"
              placeholder="Digite o numero da mesa"
              placeholderTextColor={'#9ca3af'}
              keyboardType="numeric"
              value={tableNumber}
              onChangeText={setTableNumber}
            />
            <Input
              className="border border-gray-500 bg-app-surface-alt text-white"
              placeholder="Digite o nome do cliente (opcional)"
              placeholderTextColor={'#9ca3af'}
              keyboardType="default"
              value={name}
              onChangeText={setName}
            />
            <Button
              className="active:bg-brand-primary/85 bg-brand-primary text-white"
              disabled={loading}
              onPress={handleCreateTable}>
              {loading ? <ActivityIndicator color={'#FFF'} /> : <Text>Abrir mesa</Text>}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
