import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Back } from '~/lib/assets/svgs/Svgs';
import { Plan, useAuth } from '~/providers/AuthProvider';

interface DisplayPlan extends Plan {
  image: any;
  amount: string;
  type: string;
}

const ChoosePlan = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { plans } = useAuth();
  const [investmentPlans, setInvestmentPlans] = useState<DisplayPlan[]>([]);

  useEffect(() => {
    if (plans && plans.items && plans.items.length > 0) {
      const images = [
        require('../../lib/assets/images/plan1.jpeg'),
        require('../../lib/assets/images/plan2.jpeg'),
        require('../../lib/assets/images/plan3.jpeg'),
      ];

      const updatedPlans: DisplayPlan[] = plans.items.map((plan) => ({
        ...plan,
        image: images[Math.floor(Math.random() * images.length)],
        amount: `$${plan.target_amount.toFixed(2)}`,
        type: 'Mixed assets',
      }));

      setInvestmentPlans(updatedPlans);
    }
  }, [plans]);

  return (
    <ScrollView
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 px-4">
      <View className="flex-row items-center justify-between pb-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back width={36} height={36} />
        </TouchableOpacity>
        <Text className="font-spaceg-semibold text-2xl">Choose from plans</Text>
        <View />
      </View>
      <Text className="pb-8 text-center font-dmsans-regular text-xl text-[#71879C]">
        Tap on any of the plans to select
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {investmentPlans.map((plan, index) => (
          <Pressable
            key={plan.id}
            className="mb-4 h-[243px] w-[48%] overflow-hidden rounded-xl bg-white"
            onPress={() => navigation.navigate('ChooseBank')}>
            <ImageBackground
              source={plan.image}
              className="mb-4 h-[243px] w-[100%] overflow-hidden rounded-xl bg-white">
              <View className="flex-1 justify-end p-4">
                <Text className="font-dmsans-regular text-xl text-[#FFF]">{plan.plan_name}</Text>
                <Text className="font-dmsans-regular text-xl text-[#FFF]">{plan.amount}</Text>
                <Text className="font-dmsans-regular text-xl text-[#FFF]">{plan.type}</Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default ChoosePlan;

const styles = StyleSheet.create({});
