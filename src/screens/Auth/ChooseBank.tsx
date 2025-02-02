import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { Back, CaretRight } from '~/lib/assets/svgs/Svgs';

const ChooseBank = () => {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ paddingTop: top, paddingBottom: bottom }} className="flex-1 px-4">
      <View className="flex-row items-center justify-between pb-8">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back width={36} height={36} />
        </TouchableOpacity>
        <Text className="font-spaceg-semibold text-2xl">Select bank</Text>
        <View />
      </View>
      {[
        {
          id: 'buy-rate',
          bankAccount: '0123456789  •  GTBank PLC',
          bankAccountName: 'Bosun Olanrewaju',
        },
        {
          id: '6145785229  •  Fidelity Bank',
          bankAccount: '6145785229  •  Fidelity Bank',
          bankAccountName: 'Bosun Olanrewaju',
        },
      ].map((transaction) => (
        <Pressable key={transaction.id} onPress={() => navigation.navigate('TabNavigator')}>
          <View className="my-4 flex-row items-center  justify-between">
            <View className="mr-4 flex-1 flex-row items-start">
              <View className="ml-3 flex-1">
                <Text className="flex-wrap font-dmsans-regular text-base text-[#333333]">
                  {transaction.bankAccount}
                </Text>
                <Text className="mt-1 font-dmsans-regular text-sm text-[#71879C]">
                  {transaction.bankAccountName}
                </Text>
              </View>
            </View>
            <View className="flex-col items-end justify-between">
              <CaretRight width={9} height={15} />
            </View>
          </View>
          <View className="h-[1px] w-[100%] bg-[#E0E0E0]" />
        </Pressable>
      ))}
    </View>
  );
};

export default ChooseBank;

const styles = StyleSheet.create({});
