import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Back, Info } from '~/lib/assets/svgs/Svgs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import AppButton from '~/lib/components/AppButton';
import currency from 'currency.js';
import { useAuth } from '~/providers/AuthProvider';
import Toast from 'react-native-toast-message';
const PlanReview = ({ route }: { route: { params: { planInfo: any } } }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { planInfo } = route.params;
  const { createPlan, loading } = useAuth();
  const formatCurrency = (value: string) => {
    return currency(value || 0, { precision: 2, symbol: '' }).format();
  };

  return (
    <SafeAreaView className="h-full w-full bg-white ">
      <ScrollView>
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="mb-2">
            <Back width={36} height={36} />
          </TouchableOpacity>
          <Text className="font-spaceg-semibold text-2xl">Review</Text>
          <View />
        </View>
        <View className="flex-1 items-center ">
          <View className="flex-col items-center gap-2">
            <Text className="text-md font-dmsans-regular text-[#71879C]">{planInfo.plan_name}</Text>
            <Text className="font-spaceg-semibold text-3xl">
              ${formatCurrency(planInfo.target_amount)}
            </Text>
            <Text className="text-md font-dmsans-regular text-[#333333]">
              by {planInfo.maturity_date}
            </Text>
          </View>
          <View className="my-8  items-center">
            <Image
              source={require('../../lib/assets/images/Graphs.png')}
              style={{ width: 395, height: 228 }}
            />
          </View>
          <View className="w-full flex-row items-center justify-between p-4  ">
            <Text className="font-dmsans-regular text-lg text-[#71879C]">
              Estimated monthly investment
            </Text>
            <Text className="font-dmsans-regular text-lg text-[#333333]">
              ${formatCurrency(planInfo.target_amount)}
            </Text>
          </View>
          <View className="my-4 h-[1px] w-[90%] bg-[#E0E0E0]" />

          <View className="mx-4 flex-row items-center justify-between gap-4 rounded-lg bg-[#71879C0D] p-4">
            <Info width={24} height={24} />
            <Text className="text-md w-[80%] font-dmsans-regular text-[#71879C]">
              Returns not guaranteed. Investing involves risk. Read our Disclosures.
            </Text>
          </View>
          <Text className="text-md my-4 w-[90%] text-center font-dmsans-regular text-[#71879C]">
            These are your starting settings, they can always be updated.
          </Text>

          <View className="w-full flex-1 items-center justify-center">
            <AppButton
              label="Agree & Continue"
              onPress={async () => {
                await createPlan(planInfo)
                  .then(() => {
                    navigation.navigate('PlanApproved');
                  })
                  .catch((error) => {
                    Toast.show({
                      type: 'error',
                      text1: 'Error',
                      text2: 'There was an error creating your plan. Please try again.',
                    });
                  });
              }}
              loading={loading}
              style={{ width: '90%', marginBottom: 20 }}
            />
            <AppButton
              label="Start over"
              onPress={() => {
                navigation.navigate('CreatePlan');
              }}
              style={{ backgroundColor: '#71879C1A', width: '90%' }}
              textStyle={{ color: '#71879C' }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlanReview;
