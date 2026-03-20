import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react-native';

interface SendOrderProps {
  title: string;
  back: () => void;
}

export function SendHeader({ title, back }: SendOrderProps) {
  return (
    <View className="flex flex-row items-center gap-3 border-b border-b-gray-400/10 px-4 py-3">
      <Button className="max-w-10 bg-transparent" onPress={back}>
        <ArrowLeft color={'#FFF'} size={30} />
      </Button>
      <Text className="text-center text-2xl font-bold text-white">{title}</Text>
    </View>
  );
}
