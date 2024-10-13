import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarIcon, CloseIcon, Cog, QMark } from '~/lib/assets/svgs/Svgs';
import { useNavigation } from '@react-navigation/native';
import AppButton from '~/lib/components/AppButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';

const CreatePlan = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-white px-5">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <CloseIcon width={36} height={36} />
        </TouchableOpacity>
        <Text className="font-spaceg-semibold text-2xl">Create a plan</Text>
        <View />
      </View>
      <View className="mt-5 items-center">
        <Text className="font-dmsans-regular text-lg text-APP_COLOR-MAIN_GREY_TEXT">
          Reach your goals faster
        </Text>
        <Image
          source={require('../../lib/assets/images/CreatePlan.png')}
          className="my-14 h-[100px] w-[100px]"
        />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-4 my-4 ">
          <QMark width={40} height={40} />
          <View className='flex-col flex-1'>
          <Text className="font-dmsans-semibold text-lg text-[#222222]">
          Give us a few details
        </Text>
        <Text className='font-dmsans-regular text-lg text-APP_COLOR-MAIN_GREY_TEXT'>
        Tell us what you want to achieve and we will help you get there
        </Text>
          </View>
        </View>


        <View className="flex-row items-center gap-4 my-4 ">
          <CalendarIcon width={40} height={40} />
          <View className='flex-col flex-1'>
          <Text className="font-dmsans-semibold text-lg text-[#222222]">
          Turn on auto-invest
        </Text>
        <Text className='font-dmsans-regular text-lg text-APP_COLOR-MAIN_GREY_TEXT'>
        The easiest way to get your investment working for you is to fund to periodically. 
        </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-4 my-4 ">
          <Cog width={40} height={40} />
          <View className='flex-col flex-1'>
          <Text className="font-dmsans-semibold text-lg text-[#222222]">
          Modify as you progress
        </Text>
        <Text className='font-dmsans-regular text-lg text-APP_COLOR-MAIN_GREY_TEXT'>
        You are in charge. Make changes to your plan, from adding funds, funding source, adding money to your wallet and more.
        </Text>
          </View>
        </View>
      </View>

      <View className="mt-auto mb-4">
        <AppButton
          label='Continue'
          onPress={()=>navigation.navigate('PlanDetail')}
        />
      </View>
    </View>
  );
};

export default CreatePlan;
