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

const SignIn = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { signIn, loading,setIsAuthenticated } = useAuth();
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

    return (
      validateEmail(userDetails.email) &&
      allFieldsFilled(userDetails) 
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

 



  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `} style={{paddingTop: top, paddingBottom: bottom}}>
        <View className="mt-[15%] mb-[3%]">
          <Text className="font-spaceg-medium text-2xl ">Welcome back</Text>
          <Text className="font-dmsans-regular text-lg mr-12   text-APP_COLOR-MAIN_GREY_TEXT">
          Let's get you logged in to get back to building your dollar-denominated investment portfolio.
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
       

        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Sign In'}
            disabled={!isFormValid()}
            onPress={() => 
              signIn(userDetails.email, userDetails.password)
              // setIsAuthenticated(true)
            }
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="flex-row justify-center mt-10">
           
            <Text
              className="font-dmsans-medium text-APP_COLOR-MAIN_GREEN ml-1"
           
            >
          I forgot my password
            </Text>
          </View>

        </View>
        <View className="justify-center mt-auto pb-4">
          <View className="flex-row justify-center">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT">
            Don't have an account? 
            </Text>
            <Text
              className="font-dmsans-medium text-APP_COLOR-MAIN_GREEN ml-1"
              onPress={() => navigation.navigate('SignUp')}
            >
             Sign up
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
