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
import CreatePin from '~/screens/Auth/CreatePin';
import PinApproved from '~/screens/Auth/PinApproved';
import CreatePlan from '~/screens/Dashboard/CreatePlan';
import PlanDetain from '~/screens/Dashboard/PlanDetain';
import PlanReview from '~/screens/Dashboard/PlanReview';
import PlanApproved from '~/screens/Auth/PlanApproved';
import PlanDetails from '~/screens/Dashboard/PlanDetails';
import AddFunds from '~/screens/Dashboard/AddFunds';
import ChoosePlan from '~/screens/Dashboard/ChoosePlan';
import ChooseBank from '~/screens/Auth/ChooseBank';

export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
  Onboarding:undefined;
  SignUp:undefined;
  SignIn:undefined;
  TellUsMore:undefined;
  Approved:undefined;
  CreatePin:undefined;
  PinApproved:undefined;
  CreatePlan:undefined;
  PlanDetail:undefined;
  PlanReview: {
    planInfo: {
      plan_name: string;
      target_amount: number;
      maturity_date: string;
    };
  };
  PlanApproved:undefined;
  PlanDetailScreen:undefined;
  AddFunds:undefined;
  ChoosePlan:undefined;
  ChooseBank:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const options = {
  headerShown: false,
};
export default function RootStack() {
  const { isAuthenticated, hasBeenUsed,hasPin } = useAuth();
console.log('hasPin stack', hasPin);
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
        cond: !hasPin,
        node: (
          <Fragment>
            <Stack.Screen name="CreatePin" component={CreatePin} />
            <Stack.Screen name="PinApproved" component={PinApproved} />

          </Fragment>
        ),
      },
      {
        cond: true,
        node: (
          <Fragment>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen 
              name="CreatePlan" 
              component={CreatePlan} 
              options={{
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateY: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0],
                          }),
                        },
                      ],
                    },
                  };
                },
              }}
            />
            <Stack.Screen name="PlanDetail" component={PlanDetain} />
            <Stack.Screen name="PlanReview" component={PlanReview} />
            <Stack.Screen name="PlanApproved" component={PlanApproved} />
            <Stack.Screen 
              name="PlanDetailScreen" 
              component={PlanDetails} 
              options={{
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateY: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0],
                          }),
                        },
                      ],
                    },
                  };
                },
              }}
            />
              <Stack.Screen 
              name="AddFunds" 
              component={AddFunds} 
              options={{
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateY: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0],
                          }),
                        },
                      ],
                    },
                  };
                },
              }}
            />
            <Stack.Screen name="ChoosePlan" component={ChoosePlan} />
            <Stack.Screen name="ChooseBank" component={ChooseBank} />
            <Stack.Screen name="Modal" component={Modal} />
          </Fragment>
        ),
      },
    ],
    [ hasBeenUsed, isAuthenticated,hasPin]
  );

 // Memoize the renderApp function
 const renderApp = useMemo(() => {
  return screenList.find(({ cond }) => !!cond)?.node;
}, [screenList]);

// Render the Stack Navigator with the appropriate screens
return <Stack.Navigator screenOptions={options}>{renderApp}</Stack.Navigator>;
}
