import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { APP_COLOR } from '~/core/constants/colorConstants';
import { useAuth } from '~/providers/AuthProvider';
import PinInput from '~/lib/components/PinInput';
import CustomKeypad from '~/lib/components/CustomKeypad';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';

const CreatePin = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { setPin } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [pin, setLocalPin] = useState('');

  const handlePinChange = (newPin: string) => {
    setLocalPin(newPin);
    if (newPin.length === 6) {
      Alert.alert(
        'Confirm PIN',
        'Do you want to save this PIN?',
        [
          {
            text: 'Cancel',
            onPress: () => setLocalPin(''),
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: () => {
            navigation.navigate('PinApproved')
              setPin(newPin);
              // Navigate to the next screen or show a success message
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%]`}
        style={{ paddingTop: top, paddingBottom: bottom }}
      >
        <View className="mt-[15%] mb-[3%]">
          <Text className="font-spaceg-medium text-2xl">Create a 6-digit PIN</Text>
          <Text className="font-dmsans-regular text-lg mr-12 text-APP_COLOR-MAIN_GREY_TEXT">
            You'll use this PIN to sign in and confirm transactions
          </Text>
        </View>
        <View className="mt-8">
          <PinInput value={pin} length={6} />
        </View>
        <View className="mt-[30%]">
          <CustomKeypad onKeyPress={(key) => handlePinChange(pin + key)} onDelete={() => handlePinChange(pin.slice(0, -1))} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreatePin;
