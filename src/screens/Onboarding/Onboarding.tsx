import { Image, Pressable, Text, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInLeft, SlideInLeft, SlideOutRight, FadeOutRight } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { APP_COLOR } from '~/core/constants/colorConstants';
import { FONT_NAMES } from '~/core/constants/fontConstants';
import { save } from '~/lib/utils/secureStorage';
import { useAuth } from '~/providers/AuthProvider';
import { STORAGE_KEYS } from '~/core/constants/asyncKeys';
import AppButton from '~/lib/components/AppButton'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation'; 
import { StackNavigationProp } from '@react-navigation/stack';

// Array of onboarding steps, each containing an icon, title, and description
const onboardingSteps = [
  {
    icon:<Image source={require('src/lib/assets/images/onBoardone.png')} style={{width:300,height:300}}/>,
    //  <OnBoardOne width={250} height={244} />,
    title: 'Quality assets',
    description: 'Rise invests your money into the best dollar investments around the world.',
  },
  {
    icon:<Image source={require('src/lib/assets/images/onBoardtwo.png')} style={{width:300,height:300}}/>,
    title: 'Superior Selection',
    description: "Our expert team and intelligent algorithms select assets that beat the markets.",
  },
  {
    icon:<Image source={require('src/lib/assets/images/onBoardthree.png')} style={{width:300,height:300}}/>,
    title: 'Better Performance',
    description: 'You earn more returns, achieve more of your financial goals and protect your money from devaluation.',
  },
];

const Onboarding = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { setHasBeenUsed } = useAuth();
 
  // State to track the current onboarding step
  const [step, setStep] = useState(0);
  const data = onboardingSteps[step]; // Get the current step data

  const { backgroundColor, accentColor } = useMemo(() => {
    switch (step) {
      case 0:
        return { backgroundColor: '#FEFAF7', accentColor: APP_COLOR.MAIN_ORANGE };
      case 1:
        return { backgroundColor: '#FDF4F9', accentColor: APP_COLOR.MAIN_INDIGO };
      case 2:
        return { backgroundColor: '#F6FFFE', accentColor: APP_COLOR.MAIN_TEAL };
      default:
        return { backgroundColor: APP_COLOR.MAIN_WHITE, accentColor: APP_COLOR.MAIN_GREEN };
    }
  }, [step]);

  const arrowColor = step === 0 ? APP_COLOR.DARK_GREY : accentColor;

  // Move to the next step or finish onboarding
  const onContinue = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      endOnboarding();
    }
  };

  // Mark onboarding as completed and save the state
  const endOnboarding = async () => {
    try {
      setHasBeenUsed(true);
      await save(STORAGE_KEYS.HAS_APP_BEEN_USED, 'true');
    } catch (err) {}
  };

  const onBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      if (event.velocityX < -500 && step < onboardingSteps.length - 1) {
        setStep(step + 1);
      } else if (event.velocityX > 500 && step > 0) {
        setStep(step - 1);
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View
        className={`flex-1 px-[5%]`}
        style={{ paddingTop: top, paddingBottom: bottom, backgroundColor }}
        key={`background-${step}`}
        entering={FadeInLeft.duration(300)}
        exiting={FadeOutRight.duration(300)}
      >
        <View className="flex-1 pt-[15%]">
          <View className="items-center">
            <Animated.View
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutRight.duration(300)}
              key={`icon-${step}`}
            >
              {data.icon}
            </Animated.View>
            <View className="flex-row items-center gap-2 my-[10%]">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: index === step ? accentColor : APP_COLOR.LIGHT_GREY }}
                />
              ))}
            </View>
          </View>
          <View className="items-start px-[5%] mt-5">
            <Animated.Text
              entering={SlideInLeft.delay(200)}
              exiting={SlideOutRight}
              className="font-spaceg-bold text-2xl text-left"
              style={{ color: accentColor }}
              key={`title-${step}`}
            >
              {data.title}
            </Animated.Text>
            <Animated.Text 
              entering={FadeInLeft.delay(300)}
              exiting={FadeOutRight}
              className="font-dmsans-regular text-sm text-main-dark text-left mt-2.5"
              key={`description-${step}`}
            >
              {data.description}
            </Animated.Text>
          </View>
        </View>

        <View className="absolute bottom-[10%] left-[5%] right-[5%]">
          {step === onboardingSteps.length - 1 ? (
            <>
              <AppButton 
                label="Sign up" 
                onPress={endOnboarding} 
                style={{ backgroundColor: accentColor }}
                textStyle={{ color: APP_COLOR.MAIN_WHITE }}
              />
              <AppButton 
                label="Sign in" 
                onPress={endOnboarding} 
                style={{ backgroundColor: APP_COLOR.MAIN_GREY }}
                textStyle={{ color: accentColor }}
                className="mt-2.5"
              />
            </>
          ) : (
            <View className="flex-row items-center justify-between gap-4">
              <Pressable
                onPress={onBack}
                className="flex-[0.1] bg-APP_COLOR-MAIN_GREY rounded-lg p-3.5 items-center justify-center"
              >
                <FontAwesome5 name="arrow-left" size={20} color={arrowColor} />
              </Pressable>
              <View className="flex-[0.4]">
                <AppButton 
                  onPress={onContinue} 
                  label="Next" 
                  style={{ backgroundColor: APP_COLOR.MAIN_GREY }}
                  textStyle={{ color: accentColor }}
                  rightIcon="arrow-right"
                />
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Onboarding;
