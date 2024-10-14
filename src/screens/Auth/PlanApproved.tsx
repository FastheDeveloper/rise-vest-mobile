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
import { ApprovedIcon } from '~/lib/assets/svgs/Svgs';

const PlanApproved = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { signUp, loading,setIsAuthenticated} = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

 

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View 
        className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%]`} 
        style={{paddingTop: top, paddingBottom: bottom}}
      >
        <View className="mt-[35%] items-center">
            <ApprovedIcon width={90} height={90} />
          <Text className="font-spaceg-medium text-2xl mt-10">You just created your </Text>
          <Text className="font-spaceg-medium text-2xl">your plan</Text>

          <Text className="font-dmsans-regular mx-28 text-center text-lg text-APP_COLOR-MAIN_GREY_TEXT">
          Well done, Deborah
          </Text>
        </View>
    
        {/* Add your form fields here */}
    
        <View className="flex-1" />
    
        <View className="pb-5">
          <AppButton
            label={'View plan'}
            disabled={false}
            onPress={() => 
              // signUp(userDetails.email, userDetails.password)`
              navigation.navigate('PlanDetailScreen')
         
            }
            loading={loading}
            style={{ 
              backgroundColor: APP_COLOR.MAIN_GREEN,
              marginBottom: 20 // This sets the button 20px from the bottom
            }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PlanApproved;
