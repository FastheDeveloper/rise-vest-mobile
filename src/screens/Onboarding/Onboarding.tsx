import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { FontAwesome } from '@expo/vector-icons';

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
        style={[
          styles.container,
          { paddingTop: top, paddingBottom: bottom, backgroundColor }
        ]}
        key={`background-${step}`}
        entering={FadeInLeft.duration(300)}
        exiting={FadeOutRight.duration(300)}
      >
        <View style={styles.onboardingView}>
          <View style={styles.centeredContent}>
            <Animated.View
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutRight.duration(300)}
              key={`icon-${step}`}
            >
              {data.icon}
            </Animated.View>
            <View style={styles.stepContainer}>
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepIndicator,
                    { backgroundColor: index === step ? accentColor : APP_COLOR.LIGHT_GREY },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.textContainer}>
            <Animated.Text
              entering={SlideInLeft.delay(200)}
              exiting={SlideOutRight}
              style={[styles.title, { color: accentColor }]}
              key={`title-${step}`}
            >
              {data.title}
            </Animated.Text>
            <Animated.Text 
              entering={FadeInLeft.delay(300)}
              exiting={FadeOutRight}
              style={styles.description}
              key={`description-${step}`}
            >
              {data.description}
            </Animated.Text>
          </View>
        </View>

        <View style={styles.footer}>
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
                style={{ backgroundColor: APP_COLOR.MAIN_GREY, marginTop: 10 }}
                textStyle={{ color: accentColor }}
              />
            </>
          ) : (
            <View style={styles.buttonRow}>
              <Pressable
                onPress={onBack}
                style={styles.backButton}
              >
                <FontAwesome name="arrow-left" size={20} color={arrowColor} />
              </Pressable>
              <View style={{ flex: 0.4 }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.MAIN_WHITE,
    paddingHorizontal: '5%',
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginVertical: '10%',
  },
  stepIndicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  onboardingView: {
    flex: 1,
    paddingTop: '15%',
  },
  title: {
    fontFamily: FONT_NAMES.DMSANS_MEDIUM,
    fontSize: 24,
    textAlign: 'left',
  },
  description: {
    fontFamily: FONT_NAMES.DMSANS_REGULAR,
    fontSize: 14,
    color: APP_COLOR.MAIN_GREY_TEXT,
    textAlign: 'left',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: '10%',
    left: '5%',
    right: '5%',
  },
  skipText: {
    fontFamily: FONT_NAMES.DMSANS_REGULAR,
    fontSize: 14,


  },
  backButton: {
    flex: 0.1,
    backgroundColor: APP_COLOR.MAIN_GREY,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: '5%',
    marginTop: 20,
  },
});
