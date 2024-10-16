import { Text, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { APP_COLOR } from '~/core/constants/colorConstants';

import { useAuth } from '~/providers/AuthProvider';
import AppButton from '~/lib/components/AppButton';

import { ApprovedIcon } from '~/lib/assets/svgs/Svgs';

const PinApproved = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { loading, setHasPin } = useAuth();

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View
        className={`flex-1 bg-APP_COLOR-MAIN_WHITE px-[3%]`}
        style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className="mt-[35%] items-center">
          <ApprovedIcon width={90} height={90} />
          <Text className="mt-10 font-spaceg-medium text-2xl">You've created your PIN </Text>

          <Text className="mx-28 text-center font-dmsans-regular text-lg text-APP_COLOR-MAIN_GREY_TEXT">
            Keep your account safe with your secret PIN. Do not share this PIN with anyone.
          </Text>
        </View>

        <View className="flex-1" />

        <View className="pb-5">
          <AppButton
            label={'Okay'}
            disabled={false}
            onPress={() => setHasPin(true)}
            loading={loading}
            style={{
              backgroundColor: APP_COLOR.MAIN_GREEN,
              marginBottom: 20,
            }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PinApproved;
