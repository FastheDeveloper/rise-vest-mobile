import React, { useState, useCallback } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '~/lib/components/AppButton';
import { BellIcon, PlusIcon, QuestionIcon, RiseIcon, ShareIcon } from '~/lib/assets/svgs/Svgs';
import { FONT_NAMES } from '~/core/constants/fontConstants';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import Animated, {
  FadeInLeft,
  FadeOutRight,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { APP_COLOR } from '~/core/constants/colorConstants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const userName = 'Deborah';
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [cardIndex, setCardIndex] = useState(0);
  const cardData = [
    { balance: '$10,000.00', gains: '0.21%' },
    { balance: '$15,000.00', gains: '0.35%' },
    { balance: '$8,000.00', gains: '-0.18%' },
  ];
const navigation=useNavigation<StackNavigationProp<RootStackParamList>>();
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      if (event.velocityX < -500 && cardIndex < cardData.length - 1) {
        setCardIndex(cardIndex + 1);
      } else if (event.velocityX > 500 && cardIndex > 0) {
        setCardIndex(cardIndex - 1);
      }
    })
    .runOnJS(true);

  const renderBalanceCard = useCallback(() => {
    const data = cardData[cardIndex];
    const isPositiveGain = !data.gains.startsWith('-');

    return (
      <Animated.View
        key={`card-${cardIndex}`}
        entering={FadeInLeft.duration(300)}
        exiting={FadeOutRight.duration(300)}
        className="items-center">
        <View className="flex-row items-center justify-center gap-2">
          <Text className="font-dmsans-regular text-lg text-[#71879C]">Total Balance</Text>
          <TouchableOpacity onPress={toggleBalanceVisibility}>
            <Entypo name={isBalanceVisible ? 'eye' : 'eye-with-line'} size={20} color="#0898A0" />
          </TouchableOpacity>
        </View>
        <Animated.Text
          className="my-4 text-center font-spaceg-medium text-4xl text-[#333333]"
          entering={SlideInLeft.delay(200)}
          exiting={SlideOutRight}>
          {isBalanceVisible ? data.balance : '$*****'}
        </Animated.Text>
        <View className="my-6 h-[2px] w-[200px] bg-[#71879C40]" />

        <Animated.View
          className="flex-row items-center justify-center gap-1"
          entering={SlideInLeft.delay(300)}
          exiting={SlideOutRight}>
          <Text className="font-dmsans-regular text-xl text-[#71879C]">Total Gains</Text>
          {isPositiveGain ? (
            <Feather name="arrow-up-right" size={20} color="#27BF41" />
          ) : (
            <Feather name="arrow-down-right" size={20} color="#EB5757" />
          )}
          <Text
            className={`font-dmsans-regular text-lg ${isPositiveGain ? 'text-[#27BF41]' : 'text-[#EB5757]'}`}>
            {data.gains}
          </Text>
          <AntDesign name="right" size={16} color="#71879C" />
        </Animated.View>
      </Animated.View>
    );
  }, [cardIndex, isBalanceVisible, toggleBalanceVisibility]);

  const investmentPlans = [
    {
      image: require('../../lib/assets/images/plan1.jpeg'),
      title: 'Build Wealth',
      amount: '$188.25',
      type: 'Mixed assets',
    },
    {
      image: require('../../lib/assets/images/plan2.jpeg'),
      title: 'Build Wealth',
      amount: '$188.25',
      type: 'Mixed assets',
    },
    {
      image: require('../../lib/assets/images/plan3.jpeg'),
      title: 'Build Wealth',
      amount: '$188.25',
      type: 'Mixed assets',
    },
  ];
  // const investmentPlans=[]

  return (

      <ImageBackground
        source={require('../../lib/assets/images/homeBg.png')}
        resizeMode="cover"
        className="flex-1">
         <StatusBar hidden={true} />
         <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
     
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
          className="flex-1 px-5">
            
          <View className="mb-8 flex-row justify-between">
            <View>
              <View className="flex-row items-center">
                <Text className="font-dmsans-regular text-lg text-APP_COLOR-MAIN_TEXT_DARK">
                  Good morning{' '}
                </Text>
                <Text className="font-dmsans-regular text-lg text-APP_COLOR-MAIN_TEXT_DARK">
                  ☀️
                </Text>
              </View>
              <Text className="font-dmsans-semibold text-2xl text-APP_COLOR-MAIN_TEXT_DARK">
                {userName}
              </Text>
            </View>
            <View className="flex-row items-center justify-end gap-4">
              <AppButton
                label="Earn 3% bonus"
                textStyle={{ fontSize: 12, fontFamily: FONT_NAMES.DMSANS_MEDIUM }}
                style={{ borderRadius: 100 }}
              />
              <BellIcon width={24} height={24} />
            </View>
          </View>

          <GestureDetector gesture={swipeGesture}>
            <View
              className="mb-5 items-center rounded-xl border-white p-5"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1 }}>
              {renderBalanceCard()}
              <View className="mt-4 flex-row items-center justify-center">
                {cardData.map((_, index) => (
                  <View
                    key={index}
                    className={`mx-1 h-2 rounded-full ${index === cardIndex ? 'w-4 bg-[#0898A0]' : 'w-2 bg-[#71879C]'}`}
                  />
                ))}
              </View>
            </View>
          </GestureDetector>

          <AppButton
            label="╋   Add Money"
            style={{
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0)',
              borderWidth: 1,
              borderColor: '#71879C33',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            textStyle={{
              fontSize: 20,
              fontFamily: FONT_NAMES.DMSANS_SEMIBOLD,
              color: APP_COLOR.MAIN_TEAL,
            }}
          />

          <View className="my-4 flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-spaceg-medium text-2xl text-APP_COLOR-MAIN_TEXT_DARK">
                Create a plan
              </Text>
              <View className="flex-row items-center justify-between gap-2">
                <Text
                  className={`font-dmsans-regular text-xl ${investmentPlans.length > 0 ? 'text-[#0898A0]' : 'text-[#94A1AD]'}`}>
                  View all
                </Text>
                <AntDesign
                  name="right"
                  size={16}
                  color={investmentPlans.length > 0 ? '#0898A0' : '#94A1AD'}
                />
              </View>
            </View>
            <Text className="my-2 mr-4 font-dmsans-regular text-xl text-[#94A1AD]">
              Start your investment journey by creating a plan
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}>
              <Pressable onPress={()=>navigation.navigate('CreatePlan')}  className="h-[243px] w-[180px] items-center justify-center rounded-xl bg-[#71879C1A]">
                <PlusIcon width={43} height={43} />
                <Text className="mx-4 mt-2 text-center font-dmsans-semibold text-lg text-[#333333]">
                  Create an investment plan
                </Text>
              </Pressable>
              {investmentPlans.map((plan, index) => (
                <ImageBackground
                  key={index}
                  source={plan.image}
                  className="h-[243px] w-[180px] overflow-hidden rounded-xl bg-white">
                  <View className="flex-1 justify-end p-4">
                    <Text className="font-dmsans-regular text-xl text-[#FFF]">{plan.title}</Text>
                    <Text className="font-dmsans-regular text-xl text-[#FFF]">{plan.amount}</Text>
                    <Text className="font-dmsans-regular text-xl text-[#FFF]">{plan.type}</Text>
                  </View>
                </ImageBackground>
              ))}
            </ScrollView>
          </View>
          <View className="mt-4 p-[2px] rounded-xl bg-[#40BBC326]">
            <View 
              className="w-full bg-[#0898A0] rounded-xl justify-center px-4 py-3 flex-row items-center justify-between"
              style={{
                borderColor: '#41BCC4',
                borderWidth: 2,
              }}
            >
              <View className="flex-col  gap-2 ">
                {/* <ShareIcon width={24} height={24} /> */}
                <Text className="font-dmsans-semibold text-xl text-[#FFFFFF]">TODAY'S QUOTE</Text>
                <View className="h-[2px] w-[30px] bg-[#FFFFFF] rounded-full my-4 " />
                <Text className="font-dmsans-regular text-xl text-[#FFFFFF]">
                We have no intention of rotating capital out of strong multi-year investments because they've recently done well or because 'growth' has out performed 'value'.
                </Text>
                <View className="flex-row items-center gap-2 my-4 justify-between">
                  <Text className="font-dmsans-bold text-xl text-[#FFFFFF]">
                  Carl Sagan
                  </Text>
                  <ShareIcon width={43} height={43} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-center my-4">
            <RiseIcon width={81} height={28}  />
          </View>
        </View>
        </ScrollView>
      </ImageBackground>
  
  );
}
