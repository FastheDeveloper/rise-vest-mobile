import './global.css';

import 'react-native-gesture-handler';

import RootStack from './src/navigation';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { FONT_NAMES } from '~/core/constants/fontConstants';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import AuthProvider from '~/providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {
  SplashScreen.preventAutoHideAsync();

  
  const [loaded, error] = useFonts({
    [FONT_NAMES.DMSANS_BOLD]: require('~/lib/assets/fonts/DMSans-Bold.ttf'),
    [FONT_NAMES.DMSANS_MEDIUM]: require('~/lib/assets/fonts/DMSans-Medium.ttf'),
    [FONT_NAMES.DMSANS_REGULAR]: require('~/lib/assets/fonts/DMSans-Regular.ttf'),
    [FONT_NAMES.DMSANS_SEMIBOLD]: require('~/lib/assets/fonts/DMSans-SemiBold.ttf'),
    [FONT_NAMES.SPACEG_BOLD]: require('~/lib/assets/fonts/SpaceGrotesk-Bold.ttf'),
    [FONT_NAMES.SPACEG_MEDIUM]: require('~/lib/assets/fonts/SpaceGrotesk-Medium.ttf'),
    [FONT_NAMES.SPACEG_REGULAR]: require('~/lib/assets/fonts/SpaceGrotesk-Regular.ttf'),
    [FONT_NAMES.SPACEG_SEMIBOLD]: require('~/lib/assets/fonts/SpaceGrotesk-SemiBold.ttf'),

  });
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const LottieAnimation = () => {
    return (
      <LottieView
        autoPlay
        source={require('./src/lib/assets/LottieAnimations/splash.json')}
        style={{
          flex: 1,
        }}
        resizeMode="cover"
        loop={false}
        onAnimationFinish={() => setAnimationPlayed(true)}
      />
    );
  };
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return <Text>Couldnt get fonts</Text>;
  }

  if (!animationPlayed) {
    return <LottieAnimation />;
  }
  return (
    <GestureHandlerRootView>
    <AuthProvider>
  <RootStack />
  </AuthProvider>
  </GestureHandlerRootView>
);
}
