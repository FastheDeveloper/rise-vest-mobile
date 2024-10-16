import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
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
import { Calendar } from '~/lib/assets/svgs/Svgs';
import { withModal } from '~/providers/modalService';
import { CalendarModal } from '~/lib/components/Calendar';
import { isAtLeast18YearsOld } from '~/lib/utils/fieldValidators';

const TellUsMore = withModal(({ openModal, closeModal }) => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const today = eighteenYearsAgo.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
  const { top, bottom } = useSafeAreaInsets();
  const { signUp, loading,userSignup,setUserSignup } = useAuth();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    nickName: '',
    phoneNumber: '',
    dateOfBirth: today,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
console.log(userSignup)
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

  // // Validate email when it changes
  // useEffect(() => {
  //   handleEmailBlur(userDetails.email, setErrorMessage);
  // }, [userDetails.email]);

  // Validate age when date of birth changes
  useEffect(() => {
    if (!isAtLeast18YearsOld(userDetails.dateOfBirth)) {
      setDateOfBirthError('You must be at least 18 years old to continue.');
    } else {
      setDateOfBirthError('');
    }
  }, [userDetails.dateOfBirth]);

  // Check if all fields are filled and age is valid
  const isFormValid = () => {
    return (
      userDetails.firstName &&
      userDetails.lastName &&
      userDetails.nickName &&
      userDetails.phoneNumber &&
      isAtLeast18YearsOld(userDetails.dateOfBirth)
    );
  };

  // Handler for input changes
  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle date change from calendar modal
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
        currentDate={userDetails.dateOfBirth || "2000-01-01"}
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
      <View className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%] `} style={{paddingTop: top, paddingBottom: bottom}}>
        <View className="mt-[15%] mb-[3%]">
          <Text className="font-spaceg-medium text-2xl ">Tell Us More About You</Text>
          <Text className="font-dmsans-regular text-lg mr-10   text-APP_COLOR-MAIN_GREY_TEXT">
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
            onChangeText={(text: string) => handleChange('phoneNumber', text)}
            value={userDetails.phoneNumber}
    
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />


          <TouchableWithoutFeedback onPress={OpenCalendarModal}>
            <View pointerEvents="box-only"> 
              <InputField
                label="Date of Birth"
                value={userDetails.dateOfBirth}
                editable={false}
                leftIcon={undefined}
                rightIcon={<Calendar width={24} height={24}/>}

              />
            </View>
          </TouchableWithoutFeedback>


          {dateOfBirthError && (
            <Text className="text-red-500 mt-1">{dateOfBirthError}</Text>
          )}
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
                // Handle error (e.g., show error message to user)
              }
            }}
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
});

export default TellUsMore;
