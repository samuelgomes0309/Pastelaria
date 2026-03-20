import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react-native';

interface OrderHeaderProps {
  title: string;
  delete: () => void;
}

export function OrderHeader({ title, delete: handleDelete }: OrderHeaderProps) {
  return (
    <View className="flex flex-row items-center justify-between border-b border-b-gray-400/10 px-4 py-3">
      <Text className="text-2xl font-bold text-white">{title}</Text>
      <Button className="max-w-10 bg-red-600" onPress={handleDelete}>
        <Trash color={'#FFF'} />
      </Button>
    </View>
  );
}
