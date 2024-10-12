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

const TellUsMore = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { signUp, loading } = useAuth();
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



  // Handler for input changes
  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };



 

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}>
      <View className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `} style={{paddingTop: top, paddingBottom: bottom}}>
        <View className="mt-[15%] mb-[3%]">
          <Text className="font-spaceg-medium text-2xl ">Tell Us More About You</Text>
          <Text className="font-dmsans-regular text-lg mr-10   text-APP_COLOR-MAIN_GREY_TEXT">
          Please use your name as it appears on your ID.
          </Text>
        </View>
        <View>
          <InputField
            // placeholder={'Email Address'}
            label="Legal First Name"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            keyboardType="email-address"
            leftIcon={undefined}
            
            rightIcon={undefined}
          />
           <InputField
            // placeholder={'Email Address'}
            label="Legal Last Name"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
           <InputField
            // placeholder={'Email Address'}
            label="Nick Name"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
       

          />
          <InputField
            // placeholder={'Email Address'}
            label="Phone Number"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
            value={"08079988544"}
          />
    
          <InputField
            // placeholder={'Password'}
            label="Date of Birth"
           
            onChangeText={(text: string) => handleChange('password', text)}
            leftIcon={undefined}
            rightIcon={"calendar"}
            value={"userDetails.dateOfBirth"}
          />
        </View>
       
       
        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Continue'}
            disabled={false}
            onPress={() => 
                // signUp(userDetails.email, userDetails.password)`
                navigation.navigate('Approved')
            }
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="flex-col justify-center mt-8 items-center">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_TEXT_DARK text-sm">
            By clicking Continue, you agree to our 
            </Text>
          <View className="flex-row justify-center mt-1 items-center">
          <Text
              className="font-dmsans-regular  text-APP_COLOR-MAIN_GREEN ml-1 text-sm"
              onPress={() => navigation.navigate('SignIn')}
            >
              Terms of Service
            </Text>
          <Text
              className="font-dmsans-regular text-APP_COLOR-MAIN_TEXT_DARK ml-1 text-sm"
            
            >
               and 
            </Text>
            <Text
              className="font-dmsans-regular  text-APP_COLOR-MAIN_GREEN ml-1 text-sm"
              onPress={() => navigation.navigate('SignIn')}
            >
              Privacy Policy.
            </Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default TellUsMore;
