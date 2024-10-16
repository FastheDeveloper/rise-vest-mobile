import { Image, ImageBackground, ScrollView, Settings, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretDown, CaretUp, SettingsIcon, SmallQuestion, TransparentBack } from '~/lib/assets/svgs/Svgs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import AppButton from '~/lib/components/AppButton';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '~/providers/AuthProvider';
const PlanDetails = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { top, bottom } = useSafeAreaInsets();
  const { createdPlan,userResponse } = useAuth();
  const target = '$20,053.90';
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      bounces={false} 
      className="flex-1"
    >
      <View style={{ paddingBottom: bottom * 2 + 20 }}>
        <ImageBackground
          source={require('../../lib/assets/images/bg.jpg')}
          style={{ paddingTop: top}}
          className="bg-white px-4 ">
          <View className="flex-row items-center justify-between ">
            <TouchableOpacity onPress={() => navigation.navigate('TabNavigator')}>
              <TransparentBack width={36} height={36} />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="font-spaceg-semibold text-3xl text-white  ">{createdPlan?.plan_name}</Text>
              <Text className="font-spaceg-regular text-base text-white">for ${userResponse?.first_name} Ventures</Text>
            </View>
            <TouchableOpacity>
              <SettingsIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View className=" my-8 items-center justify-center gap-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Plan Balance</Text>
          <Text className="font-spaceg-semibold text-4xl text-[#012224]">${createdPlan?.total_returns}</Text>
          <View className="flex-row items-center justify-center gap-2">
            <Text className="font-spaceg-semibold text-xl text-[#012224]">~ ₦0.00</Text>
            <SmallQuestion width={9} height={9} />
          </View>
        </View>
        <View className=" items-center justify-center gap-2">
          <Text className="font-dmsans-regular text-xl text-[#012224]">Gains</Text>
          <Text className="font-spaceg-regular text-xl text-[#27BF41]">+ ${createdPlan?.target_amount} • +12.4% </Text>
        </View>
        <View className=" flex-row items-center justify-between gap-2 p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">0.01 achieved</Text>
          <Text className="font-spaceg-regular text-xl text-[#71879C]">Target: ${createdPlan?.target_amount}</Text>
        </View>
        <View className="mx-2 mb-6 h-[10px] rounded-full bg-gray-200 mx-4">
          <View className="h-[10px] rounded-full bg-teal-500 px-2" style={{ width: `5%` }} />
        </View>
        <View className=' items-center justify-center bg-[#71879C1A] rounded-full p-2 w-auto mx-auto'>
          <Text className='font-dmsans-regular text-xl text-[#71879C] px-4'>Results are updated monthly</Text>
        </View>
        <View className=' items-center justify-center mt-8 '>
          <AppButton label='+ Fund plan'
    //    onPress={() => navigation.navigate('CreatePlan')} 
            style={{backgroundColor: '#71879C1A', width: '90%'}}
            textStyle={{color: '#0898A0'}}
          />

          <Image source={require('../../lib/assets/images/Mygraphs.png')} className='w-[385px] h-[459px] mt-8' />
        </View>
        <View className='flex-row items-center justify-between gap-2 flex-1  p-4'>
          <Text className='font-dmsans-regular text-xl text-[#71879C]'>Total earnings</Text>
          <Text className='font-spaceg-regular text-xl text-[#222222]'>$12,000.09</Text>
        </View>
        <View className='h-[1px] w-[90%] bg-[#E0E0E0] my-4'/>
        <View className='flex-row items-center justify-between gap-2 flex-1  p-4'>
          <Text className='font-dmsans-regular text-xl text-[#71879C]'>Current earnings</Text>
          <Text className='font-spaceg-regular text-xl text-[#222222]'>$12,000.09</Text>
        </View>
        <View className='h-[1px] w-[90%] bg-[#E0E0E0] my-4'/>
        <View className='flex-row items-center justify-between gap-2 flex-1  p-4'>
          <Text className='font-dmsans-regular text-xl text-[#71879C]'>Deposit value</Text>
          <Text className='font-spaceg-regular text-xl text-[#222222]'>$50,543.05</Text>
        </View>
        <View className='h-[1px] w-[90%] bg-[#E0E0E0] my-4'/>
        <View className='flex-row items-center justify-between gap-2 flex-1  p-4'>
          <Text className='font-dmsans-regular text-xl text-[#71879C]'>Balance in Naira (*₦505)</Text>
          <Text className='font-spaceg-regular text-xl text-[#222222]'>₦31,918,837.5</Text>  
        </View>
        <View className='h-[1px] w-[90%] bg-[#E0E0E0] my-4'/>
        <View className='flex-row items-center justify-between gap-2 flex-1  p-4'>
          <Text className='font-dmsans-regular text-xl text-[#71879C]'>Plan created on</Text>
          <Text className='font-spaceg-regular text-xl text-[#222222]'>23rd July, 2019</Text>  
        </View>
        <View className='h-[1px] w-[90%] bg-[#E0E0E0] my-4'/>
        <View className='flex-row items-center justify-between gap-2 flex-1 mb-12  p-4'>
          <Text className='font-dmsans-regular text-xl text-[#71879C]'>Maturity date</Text>
          <Text className='font-spaceg-regular text-xl text-[#222222]'>24th July 2022</Text>  
        </View>
        <View className="flex-row items-center justify-between px-4 pb-8">
          <Text className="font-spaceg-medium text-2xl text-APP_COLOR-MAIN_TEXT_DARK">
          Recent transactions
          </Text>
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className={`font-dmsans-regular text-xl text-[#0898A0] `}>
              View all
            </Text>
            <AntDesign
              name="right"
              size={16}
              color={ '#0898A0' }
            />
          </View>
        </View>
        <View className="space-y-4 px-4">
        {[
          { description: 'Received from Bank Account (BOSUN TONY ADEMOSU)', date: 'Jul 6, 2021', amount: '+$2,000.00' },
          { description: 'Sent to Bank Account (ADEBAYO MUSILIU JAGUN)', date: 'Jul 3, 2021', amount: '-$500.00' },
          { description: 'Sent to Service (PAYSTACK 001WA00948 - AMARDA VENTURES LIMITED)', date: 'Jul 1, 2021', amount: '+$50.75' },
          { description: 'Received from Bank Account (TITUS CLEOPATRA MEDINA)', date: 'Jun 28, 2021', amount: '-$100.00' },
        ].map((transaction, index) => (
          <View key={index} className="flex-row items-start justify-between my-4">
            <View className="flex-row items-start flex-1 mr-4">
              <View className="mt-1">
                {transaction.amount.startsWith('+') ? (
                  <CaretDown width={36} height={36} />
                ) : (
                  <CaretUp width={36} height={36} />
                )}
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-dmsans-regular text-base text-[#333333] flex-wrap">{transaction.description}</Text>
                <Text className="font-dmsans-regular text-sm text-[#71879C] mt-1">{transaction.date}</Text>
              </View>
            </View>
            <Text className={`font-spaceg-regular text-base ${transaction.amount.startsWith('+') ? 'text-[#27BF41]' : 'text-[#EB5757]'}`}>
              {transaction.amount}
            </Text>
          </View>
        ))}
      </View>
      </View>
    </ScrollView>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({});
