import { Keyboard, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { APP_COLOR } from '~/core/constants/colorConstants';
import { validateEmail, allFieldsFilled, handleEmailBlur } from '~/lib/utils/fieldValidators';
import { useAuth } from '~/providers/AuthProvider';
import InputField from '~/lib/components/InputField';
import AppButton from '~/lib/components/AppButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';

const SignUp = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { signUp, loading, setUserSignup } = useAuth();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Listeners for keyboard visibility to adjust layout
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

  // Validate email when it changes
  useEffect(() => {
    handleEmailBlur(userDetails.email, setErrorMessage);
  }, [userDetails.email]);

  // Form validation function
  const isFormValid = () => {
    const passwordValidation = isPasswordValid(userDetails.password);
    return (
      validateEmail(userDetails.email) &&
      allFieldsFilled(userDetails) &&
      passwordValidation.minLength &&
      passwordValidation.hasUpperCase &&
      passwordValidation.hasSpecialChar
    );
  };

  // Handler for input changes
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

  const isPasswordValid = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*?]/.test(password);
    return { minLength, hasUpperCase, hasSpecialChar };
  };

  const passwordValidation = isPasswordValid(userDetails.password);

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}>
      <View className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `} style={{paddingTop: top, paddingBottom: bottom}}>
        <View className="mt-[15%] mb-[3%]">
          <Text className="font-spaceg-medium text-2xl ">Create an account</Text>
          <Text className="font-dmsans-regular text-lg mr-10   text-APP_COLOR-MAIN_GREY_TEXT">
            Start building your dollar-denominated investment portfolio
          </Text>
        </View>
        <View>
          <InputField
            // placeholder={'Email Address'}
            label="Email Address"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            onFocus={handleInputFocus}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
          {errorMessage && showError && (
            <Text className="text-APP_COLOR-MAIN_RED px-[2%] font-dmsans-regular text-12">
              {errorMessage}
            </Text>
          )}
          <InputField
            // placeholder={'Password'}
            label="Password"
            secureTextEntry
            onChangeText={(text: string) => handleChange('password', text)}
            leftIcon={undefined}
            rightIcon={undefined}
          />
        </View>
       
        <View className="flex-col justify-start items-start mx-[2%] my-[3%]">
          {[
            { condition: passwordValidation.minLength, text: 'Minimum of 8 characters' },
            { condition: passwordValidation.hasUpperCase, text: 'One UPPERCASE character' },
            { condition: passwordValidation.hasSpecialChar, text: 'One unique character (e.g: !@#$%^&*?)' },
          ].map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons
                name={item.condition ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color="#008080"
              />
              <Text className="ml-2 font-dmsans-regular text-sm">{item.text}</Text>
            </View>
          ))}
        </View>
        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Sign Up'}
            disabled={!isFormValid()}
            onPress={() => 
            {
              setUserSignup({
                email_address: userDetails.email,
                password: userDetails.password,
              });
              navigation.navigate('TellUsMore');
            }}
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="flex-row justify-center mt-4">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT">
              Already have an account?
            </Text>
            <Text
              className="font-dmsans-medium text-APP_COLOR-MAIN_GREEN ml-1"
              onPress={() => navigation.navigate('SignIn')}
            >
              Sign In
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
