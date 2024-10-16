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
  const { loading, setUserSignup } = useAuth();
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
    return (
      validateEmail(userDetails.email) &&
      allFieldsFilled(userDetails) &&
      isPasswordValid(userDetails.password)
    );
  };

  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleInputFocus = () => {
    setErrorMessage('');
    setShowError(false);
  };

  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}>
      <View
        className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `}
        style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className="mb-[3%] mt-[15%]">
          <Text className="font-spaceg-medium text-2xl ">Create an account</Text>
          <Text className="mr-10 font-dmsans-regular text-lg   text-APP_COLOR-MAIN_GREY_TEXT">
            Start building your dollar-denominated investment portfolio
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

        <View className="mx-[2%] my-[3%] flex-col items-start justify-start">
          {[
            { condition: userDetails.password.length >= 8, text: 'Minimum of 8 characters' },
            { condition: /[A-Z]/.test(userDetails.password), text: 'One UPPERCASE character' },
            {
              condition: /[@$!%*?&]/.test(userDetails.password),
              text: 'One special character (@$!%*?&)',
            },
            {
              condition: /^[A-Za-z\d@$!%*?&]+$/.test(userDetails.password),
              text: 'Only letters, numbers, and special characters (@$!%*?&)',
            },
          ].map((item, index) => (
            <View key={index} className="mb-2 flex-row items-center">
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
            onPress={() => {
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
          <View className="mt-4 flex-row justify-center">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT">
              Already have an account?
            </Text>
            <Text
              className="ml-1 font-dmsans-medium text-APP_COLOR-MAIN_GREEN"
              onPress={() => navigation.navigate('SignIn')}>
              Sign In
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
