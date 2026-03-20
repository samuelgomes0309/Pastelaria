import { Category } from '@/@types/categories';
import { Optional } from '@/@types/optionals';
import { Order } from '@/@types/orders';
import { Product } from '@/@types/products';
import { OrderHeader } from '@/components/header/orderHeader';
import { Select } from '@/components/select/select';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { api } from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Minus, Plus, Trash } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Orders() {
  const { order_id } = useLocalSearchParams();
  const safeOrderId = Array.isArray(order_id) ? order_id[0] : order_id;
  if (!safeOrderId) return null;
  const router = useRouter();
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [optionals, setOptionals] = useState<Optional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedOptional, setSelectedOptional] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [itemsOrder, setItemsOrder] = useState<Order['items']>([]);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [table, setTable] = useState<string | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  useEffect(() => {
    loadInitialData();
  }, [safeOrderId]);
  useEffect(() => {
    if (selectedCategory) {
      setSelectedProduct('');
      setSelectedOptional('');
      setAmount(1);
      listProducts(selectedCategory);
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (selectedProduct) {
      setSelectedOptional('');
      setAmount(1);
      loadOptionals(selectedProduct);
    }
  }, [selectedProduct]);
  async function loadOrder(order_id: string) {
    try {
      const response = await api.get<Order>(`/orders/details/${order_id}`);
      if (!response.data) {
        setLoading(false);
        router.back();
        return;
      }
      setOrder(response.data);
      setItemsOrder(response.data.items ?? []);
      setTable(response.data.table.toString());
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar o pedido.',
      });
      router.push({ pathname: '/(authenticated)/dashboard', params: { refresh: 'true' } });
    } finally {
      setLoading(false);
    }
  }
  async function loadInitialData() {
    try {
      setLoading(true);
      await Promise.all([loadOrder(safeOrderId), listCategories()]);
    } finally {
      setLoading(false);
    }
  }
  async function listCategories() {
    try {
      const response = await api.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar categorias.',
      });
    }
  }
  async function listProducts(category_id: string) {
    setLoadingProduct(true);
    try {
      const response = await api.get<Product[]>(`/products?category_id=${category_id}`);
      setProducts(response.data);
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar produtos.',
      });
    } finally {
      setLoadingProduct(false);
    }
  }
  function loadOptionals(product_id: string) {
    const product = products.find((p) => p.id === product_id);
    if (!product || !product.productsOptionals) {
      setOptionals([]);
      return;
    }
    const optionalsOnly = product.productsOptionals.map((po) => po.optional);
    setOptionals(optionalsOnly);
  }
  function increment() {
    setAmount((prev) => (prev === 10 ? 10 : prev + 1));
  }
  function decrement() {
    setAmount((prev) => (prev > 1 ? prev - 1 : 1));
  }
  async function handleAddItem() {
    if (!selectedProduct || !selectedCategory) {
      Alert.alert('Erro', 'Selecione uma categoria e um produto.');
      return;
    }
    try {
      setLoadingAdd(true);
      const data = {
        order_id: safeOrderId,
        amount,
        product_id: selectedProduct,
        ...(selectedOptional && { optional_id: selectedOptional }),
      };
      const response = await api.post<Order>('/orders/items', data);
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Item adicionado com sucesso',
      });
      // Esse endpoint retorna o pedido com os itens atualizados mas precisamos só dos items, desmembrar
      setItemsOrder(response.data.items ?? []);
      setSelectedProduct('');
      setSelectedOptional('');
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível adicionar o item.',
      });
    } finally {
      setLoadingAdd(false);
    }
  }
  async function handleDeleteOrder() {
    try {
      setLoading(true);
      await api.delete(`/orders/${safeOrderId}`);
      router.replace({ pathname: '/(authenticated)/dashboard', params: { refresh: 'true' } });
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível deletar o pedido.',
      });
    } finally {
      setLoading(false);
    }
  }
  async function handleRemoveItem(item_id: string) {
    if (!item_id) return;
    try {
      setSelectedItem(item_id);
      setLoadingRemove(true);
      const response = await api.delete<Order>(`/orders/remove/${item_id}`, {
        params: {
          order_id: safeOrderId,
        },
      });
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Item removido com sucesso',
      });
      // Esse endpoint retorna o pedido com os itens atualizados mas precisamos só dos items, desmembrar
      setItemsOrder(response.data.items ?? []);
    } catch (error: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível remover o item.',
      });
    } finally {
      setLoadingRemove(false);
      setSelectedItem('');
    }
  }
  if (loading || !safeOrderId) {
    return (
      <View className="flex flex-1 items-center justify-center bg-app-background">
        <ActivityIndicator size="large" color="#f6005d" />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-app-background">
      <OrderHeader title={`Mesa - ${table}`} delete={handleDeleteOrder} />
      <View className="flex flex-1 flex-col items-center justify-between px-4 py-2">
        <View className="w-full">
          {categories.length > 0 && (
            <Select
              label="Categorias"
              placeholder="Selecione uma categoria"
              selected={selectedCategory}
              disabled={loadingProduct}
              onChangeSelected={setSelectedCategory}
              options={categories.map((category) => ({ id: category.id, name: category.name }))}
            />
          )}
          {selectedCategory &&
            (loadingProduct ? (
              <ActivityIndicator color={'#FFF'} />
            ) : (
              <Select
                placeholder="Selecione um produto"
                selected={selectedProduct}
                onChangeSelected={setSelectedProduct}
                options={products.map((product) => ({
                  id: product.id,
                  name: product.name,
                }))}
              />
            ))}
          {selectedProduct && optionals.length > 0 && !loadingProduct && (
            <Select
              placeholder="Selecione um opcional"
              selected={selectedOptional}
              onChangeSelected={setSelectedOptional}
              options={optionals.map((optional) => ({ id: optional.id, name: optional.name }))}
            />
          )}
          {selectedProduct && !loadingProduct && (
            <View className="mt-2 px-4">
              <View className="flex w-full flex-row items-center justify-between">
                <Text className="text-white">Quantidade</Text>
                <View className="flex flex-row gap-2">
                  <Button
                    className="flex w-10 items-center justify-center rounded-md bg-red-500 active:bg-red-500/75 disabled:bg-red-500/40"
                    android_ripple={{ color: 'transparent' }}
                    onPress={decrement}
                    disabled={amount === 1 || loadingAdd}>
                    <Minus color={'#FFF'} />
                  </Button>
                  <View className="flex min-w-12 max-w-20 items-center justify-center rounded-md border border-gray-600/80 bg-app-surface-alt px-2 py-1.5">
                    <Text className="text-white">{amount}</Text>
                  </View>
                  <Button
                    className="flex w-10 items-center justify-center rounded-md bg-green-600 active:bg-green-600/75 disabled:bg-green-600/70"
                    android_ripple={{ color: 'transparent' }}
                    onPress={increment}
                    disabled={amount === 10 || loadingAdd}>
                    <Plus color={'#FFF'} />
                  </Button>
                </View>
              </View>
              <Button
                className="my-2 mt-3 bg-blue-600/80 text-white active:bg-blue-600/75 disabled:bg-blue-600/40"
                onPress={handleAddItem}
                disabled={loadingAdd || amount === 0}
                android_ripple={{ color: 'transparent' }}>
                {loadingAdd ? <ActivityIndicator color={'#FFF'} /> : <Text>Adicionar</Text>}
              </Button>
            </View>
          )}
        </View>
        {itemsOrder?.length > 0 && (
          <View className="mt-1 flex flex-1 items-center justify-between px-4 py-2">
            <Text className="font-medium text-white">Items já selecionados</Text>
            <FlatList
              data={itemsOrder}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="my-2 flex w-full flex-row items-center justify-between rounded-md border border-gray-500/30 bg-app-surface-alt px-4 py-2">
                  <View>
                    <Text className="text-white">{item.product.name}</Text>
                    <Text className="text-gray-400">
                      {item.amount}x - R$ {(item.product.price / 100).toFixed(2)}
                    </Text>
                    {item?.itemsOptionals?.length ? (
                      <>
                        <Text className="text-gray-400">
                          {item.itemsOptionals.length} Opcional
                          {item.itemsOptionals.length > 1 ? 's' : ''}
                        </Text>
                        {item.itemsOptionals?.map((optional) => {
                          const optionalData = optional?.product_optional?.optional;
                          return (
                            <Text key={optionalData?.id} className="text-gray-400">
                              {optionalData?.name ?? 'Opcional'} - R${' '}
                              {optionalData?.price ? (optionalData.price / 100).toFixed(2) : '0.00'}
                            </Text>
                          );
                        })}
                      </>
                    ) : null}
                  </View>
                  <Button
                    className="max-w-10 bg-transparent"
                    onPress={() => handleRemoveItem(item.id)}
                    disabled={loadingRemove}>
                    {loadingRemove && selectedItem === item.id ? (
                      <ActivityIndicator color={'#F00'} />
                    ) : (
                      <Trash color={'#F00'} />
                    )}
                  </Button>
                </View>
              )}
            />
          </View>
        )}
        <Button
          className="active:bg-brand-primary/85 w-full bg-brand-primary text-white"
          android_ripple={{ color: 'transparent' }}
          disabled={loading || itemsOrder?.length === 0}
          onPress={() => {
            router.push({
              pathname: '/orders/[order_id]/checkout',
              params: {
                order_id: safeOrderId,
                table: table,
              },
            });
          }}>
          {loading ? <ActivityIndicator color={'#FFF'} /> : <Text>Avançar</Text>}
        </Button>
      </View>
    </SafeAreaView>
  );
}
