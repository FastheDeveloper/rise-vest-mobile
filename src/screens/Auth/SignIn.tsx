import { Keyboard, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { APP_COLOR } from '~/core/constants/colorConstants';
import { validateEmail, allFieldsFilled, handleEmailBlur } from '~/lib/utils/fieldValidators';
import { useAuth } from '~/providers/AuthProvider';
import InputField from '~/lib/components/InputField';
import AppButton from '~/lib/components/AppButton';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';

const SignIn = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn, loading, setIsAuthenticated } = useAuth();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    handleEmailBlur(userDetails.email, setErrorMessage);
  }, [userDetails.email]);

  const isFormValid = () => {
    return validateEmail(userDetails.email) && allFieldsFilled(userDetails);
  };

  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Reset error messages when an input field is focused
  const handleInputFocus = () => {
    setErrorMessage('');
    setShowError(false);
  };

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View
        className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `}
        style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className="mb-[3%] mt-[15%]">
          <Text className="font-spaceg-medium text-2xl ">Welcome back</Text>
          <Text className="mr-12 font-dmsans-regular text-lg   text-APP_COLOR-MAIN_GREY_TEXT">
            Let's get you logged in to get back to building your dollar-denominated investment
            portfolio.
          </Text>
        </View>
        <View>
          <InputField
            label="Email Address"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            onFocus={handleInputFocus}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
          {errorMessage && showError && (
            <Text className="text-12 px-[2%] font-dmsans-regular text-APP_COLOR-MAIN_RED">
              {errorMessage}
            </Text>
          )}
          <InputField
            label="Password"
            secureTextEntry
            onChangeText={(text: string) => handleChange('password', text)}
            leftIcon={undefined}
            rightIcon={undefined}
          />
        </View>

        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Sign In'}
            disabled={!isFormValid()}
            onPress={() => signIn(userDetails.email, userDetails.password)}
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="mt-10 flex-row justify-center">
            <Text className="ml-1 font-dmsans-medium text-APP_COLOR-MAIN_GREEN">
              I forgot my password
            </Text>
          </View>
        </View>
        <View className="mt-auto justify-center pb-4">
          <View className="flex-row justify-center">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT">
              Don't have an account?
            </Text>
            <Text
              className="ml-1 font-dmsans-medium text-APP_COLOR-MAIN_GREEN"
              onPress={() => navigation.navigate('SignUp')}>
              Sign up
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
