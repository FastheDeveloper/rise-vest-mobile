import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';

import TabNavigator from './tab-navigator';
import Modal from '../screens/modal';
import Onboarding from '~/screens/Onboarding/Onboarding';
import SignUp from '~/screens/Auth/SignUp';
import { useAuth } from '~/providers/AuthProvider';
import { Fragment, useMemo } from 'react';
import TellUsMore from '~/screens/Auth/TellUsMore';
import SignIn from '~/screens/Auth/SignIn';
import Approved from '~/screens/Auth/Approved';

export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
  Onboarding:undefined;
  SignUp:undefined;
  SignIn:undefined;
  TellUsMore:undefined;
  Approved:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const options = {
  headerShown: false,
};
export default function RootStack() {
  const { isAuthenticated, hasBeenUsed } = useAuth();

  const screenList = useMemo(
    () => [
      {
        cond: !hasBeenUsed,
        node: (
          <Fragment>
            <Stack.Screen name={'Onboarding'} component={Onboarding} />
          </Fragment>
        ),
      },
      {
        cond: !isAuthenticated,
        node: (
          <Fragment>
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="TellUsMore" component={TellUsMore} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Approved" component={Approved} />
          </Fragment>
        ),
      },
      {
        cond: true,
        node: (
          <Fragment>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Modal" component={Modal} />
          </Fragment>
        ),
      },
    ],
    [ hasBeenUsed, isAuthenticated]
  );

 // Memoize the renderApp function
 const renderApp = useMemo(() => {
  return screenList.find(({ cond }) => !!cond)?.node;
}, [screenList]);

// Render the Stack Navigator with the appropriate screens
return <Stack.Navigator screenOptions={options}>{renderApp}</Stack.Navigator>;
}
