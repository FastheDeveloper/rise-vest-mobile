import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretDown, CloseIcon } from '~/lib/assets/svgs/Svgs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AppButton from '~/lib/components/AppButton';

const AddFunds = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Variables for the bottom sheet
  const snapPoints = useMemo(() => ['80%'], []);

  // Callbacks for the bottom sheet
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        navigation.goBack();
      }
    },
    [navigation]
  );

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 px-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CloseIcon width={36} height={36} />
        </TouchableOpacity>
        <Text className="font-spaceg-semibold text-2xl">Fund Wallet</Text>
        <View />
      </View>

      <View className="flex-1">
        {[
          {
            description: 'Naira Bank Transfer',
            date: 'Jul 6, 2021',
            amount: 'Rate - $1 = ₦490',
            fee: '+$10',
          },
          {
            description: 'Naira Debit card',
            date: 'Jul 3, 2021',
            amount: 'Rate - $1 = ₦490',
            fee: '+$10',
          },
          {
            description: 'Naira direct deposit',
            date: 'Jul 1, 2021',
            amount: 'Rate - $1 = ₦490',
            fee: '+$10',
          },
          {
            description: 'Bank Transfer',
            date: 'Jun 28, 2021',
            amount: 'Rate - $1 = ₦490',
            fee: '+$10',
          },
        ].map((transaction, index) => (
          <View key={index} className="my-4 flex-row items-start justify-between">
            <View className="mr-4 flex-1 flex-row items-start">
              <View className="mt-1">
                <CaretDown width={36} height={36} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="flex-wrap font-dmsans-regular text-base text-[#333333]">
                  {transaction.description}
                </Text>
                <Text className="mt-1 font-dmsans-regular text-sm text-[#71879C]">
                  {transaction.date}
                </Text>
              </View>
            </View>
            <View className="flex-col items-end justify-between">
              <Text className={`font-spaceg-regular text-base text-[#71879C]`}>
                {transaction.amount}
              </Text>
              <Text className={`font-spaceg-regular text-base text-[#71879C]`}>
                {transaction.fee}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <View className="px-4 py-2">
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <CloseIcon width={36} height={36} />
            </TouchableOpacity>
            <Text className="font-spaceg-semibold text-xl">About Exchange Rates</Text>
            <View />
          </View>
          <BottomSheetScrollView className="pb-8">
            {[
              {
                description: 'USD Buy Rate',
                date: 'We buy US dollars at this rate',
                amount: '₦490',
                fee: '+$10',
              },
              {
                description: 'USD Sell Rate',
                date: 'The current value of your investments in Naira',
                amount: '₦490',
                fee: '+$10',
              },
            ].map((transaction, index) => (
              <View>
                <View key={index} className="my-4 flex-row items-start justify-between">
                  <View className="mr-4 flex-1 flex-row items-start">
                    <View className="ml-3 flex-1">
                      <Text className="flex-wrap font-dmsans-regular text-base text-[#333333]">
                        {transaction.description}
                      </Text>
                      <Text className="mt-1 font-dmsans-regular text-sm text-[#71879C]">
                        {transaction.date}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-col items-end justify-between">
                    <Text className={`font-spaceg-regular text-base text-[#71879C]`}>
                      {transaction.amount}
                    </Text>
                    <Text className={`font-spaceg-regular text-base text-[#71879C]`}>
                      {transaction.fee}
                    </Text>
                  </View>
                </View>
                <View className="h-[1px] w-[100%] bg-[#E0E0E0]" />
            
              </View>
            ))}
            <Text className="font-dmsans-regular text-center my-8 text-sm text-[#71879C]">
            These exhange rates are provided by independent third parties who handle fund conversions at the prevailing parallel rates and are not set, or controlled or by Rise. They are subject to change based on market trends.
            </Text>
            <AppButton
      label="Accept & Continue"
      onPress={() => {
  
        navigation.navigate('ChoosePlan');
      }}
      style={{width:'90%', marginBottom:20}}
      />
      <View className='flex-1 items-center justify-center w-full h-[200px]'/ >
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    </View>
  );
};

export default AddFunds;

const styles = StyleSheet.create({});
