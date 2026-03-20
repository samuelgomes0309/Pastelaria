import { Modal, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { ArrowDown, Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';

type Options = {
  id: string;
  name: string;
};

type SelectProps = {
  label?: string;
  options: Options[];
  selected: string;
  placeholder: string;
  disabled?: boolean;
  onChangeSelected: (id: string) => void;
};

export function Select({
  label,
  options,
  selected,
  onChangeSelected,
  placeholder,
  disabled = false,
}: SelectProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Options | null>(null);
  useEffect(() => {
    if (selected === '') {
      setSelectedOption(null);
    } else {
      const option = options.find((o) => o.id === selected) || null;
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [selected, options]);
  function handleSelected(option: Options) {
    onChangeSelected(option.id);
    setSelectedOption(option);
    setIsModalVisible(false);
  }
  return (
    <View className="my-2 px-4">
      {label && <Text className="mb-2 text-white/80">{label}</Text>}
      <Button
        className="active:bg-app-surface-alt/80 flex items-center justify-between overflow-hidden rounded-md border border-gray-600/80 bg-app-surface-alt"
        onPress={() => setIsModalVisible(true)}
        android_ripple={{ color: 'transparent' }}
        disabled={disabled}>
        <Text className="text-white">
          {selectedOption !== null ? selectedOption.name : placeholder}
        </Text>
        <ArrowDown color={'#FFF'} />
      </Button>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <Pressable className="flex-1" onPress={() => setIsModalVisible(false)}>
          <View
            className="bg-app-background/80 elevation-lg flex-1 items-center justify-center px-4 pt-10"
            pointerEvents="box-none">
            <View
              className={`${label ? 'justify-between' : 'justify-end'} flex w-4/5 flex-row items-center rounded-t-md border-b-transparent bg-zinc-500 px-4 py-2`}>
              {label && <Text className="font-bold text-white">{label}</Text>}
              <Button
                className="bg-red-700 active:bg-red-700/40"
                onPress={() => setIsModalVisible(false)}
                android_ripple={{ color: 'transparent' }}>
                <X color={'#FFF'} />
              </Button>
            </View>
            {options.map((option) => {
              const isSelected = option.id === selected;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    isSelected ? setIsModalVisible(false) : handleSelected(option);
                  }}
                  className="flex w-4/5 flex-row items-center justify-between bg-app-surface-elevated px-4 py-2"
                  android_ripple={{ color: 'transparent' }}>
                  <Text className={`${isSelected ? 'text-green-400' : 'text-white'} `}>
                    {option.name}
                  </Text>
                  {isSelected && <Check color={'#4ade80'} />}
                </Pressable>
              );
            })}
            {/* Mudar o options.map para FlatList */}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
