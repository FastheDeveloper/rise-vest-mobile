import './global.css';

import 'react-native-gesture-handler';

import RootStack from './src/navigation';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { FONT_NAMES } from '~/core/constants/fontConstants';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import AuthProvider, { useAuth } from '~/providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { ModalsProvider } from '~/providers/modalService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

const AppContent = () => {
  const { authChecked } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
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


  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!animationPlayed && !!authChecked && !!fontsLoaded) {
    SplashScreen.hideAsync();
    return <LottieAnimation setAnimationPlayed={setAnimationPlayed} />;
  }

  return <RootStack />;
};

const LottieAnimation = ({
  setAnimationPlayed,
}: {
  setAnimationPlayed: (played: boolean) => void;
}) => {
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

export default function App() {
  SplashScreen.preventAutoHideAsync();
  const toastConfig = {
    success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#28a745', backgroundColor: '#333' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}
        text2Style={{ fontSize: 14, color: '#ddd' }}
      />
    ),
    error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: '#dc3545', backgroundColor: '#333' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}
        text2Style={{ fontSize: 14, color: '#ddd' }}
      />
    ),
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AuthProvider>
            <ModalsProvider>
              <AppContent />
              <Toast config={toastConfig} />
            </ModalsProvider>
          </AuthProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
