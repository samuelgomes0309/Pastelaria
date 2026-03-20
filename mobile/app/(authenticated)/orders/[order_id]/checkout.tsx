import { SendHeader } from '@/components/header/sendHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { api } from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Checkout() {
  const { order_id, table } = useLocalSearchParams();
  const safeOrderId = Array.isArray(order_id) ? order_id[0] : order_id;
  if (!safeOrderId) return null;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function handleSendOrder() {
    Alert.alert('Confirmar', `Deseja enviar o pedido da mesa ${table}?`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Enviar',
        onPress: async () => {
          try {
            setLoading(true);
            await api.patch(`/orders/${safeOrderId}/send`);
            Toast.show({
              type: 'success',
              text1: 'Sucesso',
              text2: `Mesa ${table} enviada com sucesso`,
            });
            setTimeout(() => {
              router.replace({
                pathname: '/(authenticated)/dashboard',
                params: { refresh: 'true' },
              });
            }, 1000);
          } catch (error: any) {
            console.log(error.response.data);
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: 'Não foi possível enviar o pedido',
            });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }
  return (
    <SafeAreaView className="flex flex-1 bg-app-background px-4">
      <SendHeader back={() => router.back()} title="Voltar" />
      <View className="my-28 flex items-center justify-center gap-4">
        <Text className="text-center text-2xl text-white">Mesa - {table}</Text>
        <Button
          className="active:bg-brand-primary/85 w-full bg-brand-primary text-white"
          android_ripple={{ color: 'transparent' }}
          onPress={handleSendOrder}
          disabled={loading}>
          {loading ? <Text>Enviando...</Text> : <Text>Enviar</Text>}
        </Button>
      </View>
    </SafeAreaView>
  );
}
