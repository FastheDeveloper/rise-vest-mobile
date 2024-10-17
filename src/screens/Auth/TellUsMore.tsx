import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { APP_COLOR } from '~/core/constants/colorConstants';

import { useAuth } from '~/providers/AuthProvider';
import InputField from '~/lib/components/InputField';
import AppButton from '~/lib/components/AppButton';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { Calendar } from '~/lib/assets/svgs/Svgs';
import { withModal } from '~/providers/modalService';
import { CalendarModal } from '~/lib/components/Calendar';
import { isAtLeast18YearsOld } from '~/lib/utils/fieldValidators';
import PhoneInput from 'react-native-phone-number-input';

const TellUsMore = withModal(({ openModal, closeModal }) => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const today = eighteenYearsAgo.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
  const { top, bottom } = useSafeAreaInsets();
  const { signUp, loading, userSignup, setUserSignup } = useAuth();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    nickName: '',
    phoneNumber: ' ',
    dateOfBirth: today,
  });
  const phoneInput = useRef<PhoneInput>(null);
  const [dateOfBirthError, setDateOfBirthError] = useState('');
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
    if (!isAtLeast18YearsOld(userDetails.dateOfBirth)) {
      setDateOfBirthError('You must be at least 18 years old to continue.');
    } else {
      setDateOfBirthError('');
    }
  }, [userDetails.dateOfBirth]);

  const isFormValid = () => {
    return (
      userDetails.firstName &&
      userDetails.lastName &&
      userDetails.nickName &&
      userDetails.phoneNumber &&
      isAtLeast18YearsOld(userDetails.dateOfBirth)
    );
  };

  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const taskCreatedDate = (date: any) => {
    const convertDate = new Date(date.timestamp);
    const formattedDate = convertDate.toISOString().split('T')[0];
    handleChange('dateOfBirth', formattedDate);
    closeModal();
  };

  function OpenCalendarModal() {
    openModal?.(
      <CalendarModal
        onDateSelected={taskCreatedDate}
        closeModal={closeModal}
        currentDate={userDetails.dateOfBirth || '2000-01-01'}
      />,
      {
        transparent: true,
        animationType: 'none',
      }
    );
  }

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}>
      <View
        className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `}
        style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className="mb-[3%] mt-[15%]">
          <Text className="font-spaceg-medium text-2xl ">Tell Us More About You</Text>
          <Text className="mr-10 font-dmsans-regular text-lg   text-APP_COLOR-MAIN_GREY_TEXT">
            Please use your name as it appears on your ID.
          </Text>
        </View>
        <View>
          <InputField
            label="Legal First Name"
            onChangeText={(text: string) => handleChange('firstName', text)}
            value={userDetails.firstName}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
          <InputField
            label="Legal Last Name"
            onChangeText={(text: string) => handleChange('lastName', text)}
            value={userDetails.lastName}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
          <InputField
            label="Nick Name"
            onChangeText={(text: string) => handleChange('nickName', text)}
            value={userDetails.nickName}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
          <InputField
            label="Phone Number"
            value={userDetails.phoneNumber}
            editable={false}
            keyboardType="phone-pad"
            leftIcon={undefined}
            rightIcon={undefined}
            style={{
              width: '100%',
              height: 100,
            }}
          >
            <PhoneInput
              ref={phoneInput}
              defaultValue={userDetails.phoneNumber}
              defaultCode="NG"
              layout="first"
              onChangeText={(text) => {
                handleChange('phoneNumber', text);
              }}
              onChangeFormattedText={(text) => {
                handleChange('phoneNumber', text);
              }}
              
           
              containerStyle={{
                width: '100%',
             marginVertical:5,

              }}
              textContainerStyle={{
                width: '100%',
                height: 60,
                backgroundColor:'white',
                
                
                // paddingVertical:10
              }}
              codeTextStyle={{
                color: 'black',
                fontSize: 16,
              }}
        
              textInputStyle={{
                color: 'black',
                fontSize: 16,
                marginTop:1
              }}
              
            />
          </InputField>

          
          <TouchableWithoutFeedback onPress={OpenCalendarModal}>
            <View pointerEvents="box-only">
              <InputField
                label="Date of Birth"
                value={userDetails.dateOfBirth}
                editable={false}
                leftIcon={undefined}
                rightIcon={<Calendar width={24} height={24} />}
              />
            </View>
          </TouchableWithoutFeedback>

          {dateOfBirthError && <Text className="mt-1 text-red-500">{dateOfBirthError}</Text>}
        </View>
        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Continue'}
            disabled={!isFormValid()}
            onPress={async () => {
              const updatedUserSignup = {
                ...userSignup,
                first_name: userDetails.firstName,
                last_name: userDetails.lastName,
                date_of_birth: userDetails.dateOfBirth,
              };

              setUserSignup(updatedUserSignup);

              try {
                await signUp(updatedUserSignup);
                navigation.navigate('SignIn');
              } catch (error) {
                console.error('Error during sign up:', error);
              }
            }}
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="mt-8 flex-col items-center justify-center">
            <Text className="font-dmsans-regular text-sm text-APP_COLOR-MAIN_TEXT_DARK">
              By clicking Continue, you agree to our
            </Text>
            <View className="mt-1 flex-row items-center justify-center">
              <Text
                className="ml-1  font-dmsans-regular text-sm text-APP_COLOR-MAIN_GREEN"
                onPress={() => navigation.navigate('SignIn')}>
                Terms of Service
              </Text>
              <Text className="ml-1 font-dmsans-regular text-sm text-APP_COLOR-MAIN_TEXT_DARK">
                and
              </Text>
              <Text
                className="ml-1  font-dmsans-regular text-sm text-APP_COLOR-MAIN_GREEN"
                onPress={() => navigation.navigate('SignIn')}>
                Privacy Policy.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
});

export default TellUsMore;
