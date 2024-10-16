import {
  Image,
  ImageBackground,
  ScrollView,
  Settings,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CaretDown,
  CaretUp,
  SettingsIcon,
  SmallQuestion,
  TransparentBack,
} from '~/lib/assets/svgs/Svgs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import AppButton from '~/lib/components/AppButton';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '~/providers/AuthProvider';
import currency from 'currency.js';

const PlanDetails = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { top, bottom } = useSafeAreaInsets();
  const { createdPlan, userResponse, rates } = useAuth();
  const formatCurrency = (value: string) => {
    return currency(value || 0, { precision: 2, symbol: '' }).format();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    let dayWithSuffix = day.toString();
    if (day >= 11 && day <= 13) {
      dayWithSuffix += 'th';
    } else {
      switch (day % 10) {
        case 1:
          dayWithSuffix += 'st';
          break;
        case 2:
          dayWithSuffix += 'nd';
          break;
        case 3:
          dayWithSuffix += 'rd';
          break;
        default:
          dayWithSuffix += 'th';
      }
    }

    return `${dayWithSuffix} ${month} ${year}`;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false} className="flex-1">
      <View style={{ paddingBottom: bottom * 2 + 20 }}>
        <ImageBackground
          source={require('../../lib/assets/images/bg.jpg')}
          style={{ paddingTop: top }}
          className="bg-white px-4 pb-8 ">
          <View className="flex-row items-center justify-between ">
            <TouchableOpacity onPress={() => navigation.navigate('TabNavigator')}>
              <TransparentBack width={36} height={36} />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="font-spaceg-semibold text-3xl text-white  ">
                {createdPlan?.plan_name}
              </Text>
              <Text className="font-spaceg-regular text-base text-white">
                for {userResponse?.first_name} Ventures
              </Text>
            </View>
            <TouchableOpacity>
              <SettingsIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View className=" my-8 items-center justify-center gap-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Plan Balance</Text>
          <Text className="font-spaceg-semibold text-4xl text-[#012224]">
            ${formatCurrency(createdPlan?.total_returns.toString() || '0')}
          </Text>
          <View className="flex-row items-center justify-center gap-2">
            <Text className="font-spaceg-semibold text-xl text-[#012224]">~ ₦0.00</Text>
            <SmallQuestion width={9} height={9} />
          </View>
        </View>
        <View className=" items-center justify-center gap-2">
          <Text className="font-dmsans-regular text-xl text-[#012224]">Gains</Text>
          <Text className="font-spaceg-regular text-xl text-[#27BF41]">+ $0.00 • +12.4% </Text>
        </View>
        <View className=" flex-row items-center justify-between gap-2 p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">0.01 achieved</Text>
          <Text className="font-spaceg-regular text-xl text-[#71879C]">
            Target: ${formatCurrency(createdPlan?.target_amount.toString() || '0')}
          </Text>
        </View>
        <View className="mx-2 mx-4 mb-6 h-[10px] rounded-full bg-gray-200">
          <View className="h-[10px] rounded-full bg-teal-500 px-2" style={{ width: `5%` }} />
        </View>
        <View className=" mx-auto w-auto items-center justify-center rounded-full bg-[#71879C1A] p-2">
          <Text className="px-4 font-dmsans-regular text-xl text-[#71879C]">
            Results are updated monthly
          </Text>
        </View>
        <View className=" mt-8 items-center justify-center ">
          <AppButton
            label="+ Fund plan"
            onPress={() => navigation.navigate('AddFunds')}
            style={{ backgroundColor: '#71879C1A', width: '90%' }}
            textStyle={{ color: '#0898A0' }}
          />

          <Image
            source={require('../../lib/assets/images/Mygraphs.png')}
            className="mt-8 h-[459px] w-[385px]"
          />
        </View>
        <View className="flex-1 flex-row items-center justify-between gap-2  p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Total earnings</Text>
          <Text className="font-spaceg-regular text-xl text-[#222222]">
            ${formatCurrency(createdPlan?.total_returns.toString() || '0')}
          </Text>
        </View>
        <View className="my-4 h-[1px] w-[90%] bg-[#E0E0E0]" />
        <View className="flex-1 flex-row items-center justify-between gap-2  p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Current earnings</Text>
          <Text className="font-spaceg-regular text-xl text-[#222222]">
            ${formatCurrency(createdPlan?.returns.toString() || '0')}
          </Text>
        </View>
        <View className="my-4 h-[1px] w-[90%] bg-[#E0E0E0]" />
        <View className="flex-1 flex-row items-center justify-between gap-2  p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Deposit value</Text>
          <Text className="font-spaceg-regular text-xl text-[#222222]">
            ${formatCurrency(createdPlan?.invested_amount.toString() || '0')}
          </Text>
        </View>
        <View className="my-4 h-[1px] w-[90%] bg-[#E0E0E0]" />
        <View className="flex-1 flex-row items-center justify-between gap-2  p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">
            Balance in Naira (*₦{formatCurrency(rates?.buy_rate.toString() || '0')})
          </Text>
          <Text className="font-spaceg-regular text-xl text-[#222222]">
            ₦{formatCurrency(userResponse?.total_balance.toString() || '0')}
          </Text>
        </View>
        <View className="my-4 h-[1px] w-[90%] bg-[#E0E0E0]" />
        <View className="flex-1 flex-row items-center justify-between gap-2  p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Plan created on</Text>
          <Text className="font-spaceg-regular text-xl text-[#222222]">
            {formatDate(createdPlan?.created_at || '')}
          </Text>
        </View>
        <View className="my-4 h-[1px] w-[90%] bg-[#E0E0E0]" />
        <View className="mb-12 flex-1 flex-row items-center justify-between gap-2  p-4">
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Maturity date</Text>
          <Text className="font-spaceg-regular text-xl text-[#222222]">
            {formatDate(createdPlan?.maturity_date || '')}
          </Text>
        </View>
        <View className="flex-row items-center justify-between px-4 pb-8">
          <Text className="font-spaceg-medium text-2xl text-APP_COLOR-MAIN_TEXT_DARK">
            Recent transactions
          </Text>
          <View className="flex-row items-center justify-between gap-2">
            <Text className={`font-dmsans-regular text-xl text-[#0898A0] `}>View all</Text>
            <AntDesign name="right" size={16} color={'#0898A0'} />
          </View>
        </View>
        <View className="space-y-4 px-4">
          {[
            {
              description: 'Received from Bank Account (BOSUN TONY ADEMOSU)',
              date: 'Jul 6, 2021',
              amount: '+$2,000.00',
            },
            {
              description: 'Sent to Bank Account (ADEBAYO MUSILIU JAGUN)',
              date: 'Jul 3, 2021',
              amount: '-$500.00',
            },
            {
              description: 'Sent to Service (PAYSTACK 001WA00948 - AMARDA VENTURES LIMITED)',
              date: 'Jul 1, 2021',
              amount: '+$50.75',
            },
            {
              description: 'Received from Bank Account (TITUS CLEOPATRA MEDINA)',
              date: 'Jun 28, 2021',
              amount: '-$100.00',
            },
          ].map((transaction, index) => (
            <View key={index} className="my-4 flex-row items-start justify-between">
              <View className="mr-4 flex-1 flex-row items-start">
                <View className="mt-1">
                  {transaction.amount.startsWith('+') ? (
                    <CaretDown width={36} height={36} />
                  ) : (
                    <CaretUp width={36} height={36} />
                  )}
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
              <Text
                className={`font-spaceg-regular text-base ${transaction.amount.startsWith('+') ? 'text-[#27BF41]' : 'text-[#EB5757]'}`}>
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
