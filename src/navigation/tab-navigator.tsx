import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useRef, useEffect } from 'react';
import { Text, View, Animated, Image } from 'react-native';

import { RootStackParamList } from '.';
import { HeaderButton } from '../lib/components/HeaderButton';
import One from '../screens/Dashboard/one';
import Two from '../screens/Dashboard/two';
import { ActiveTabDot, FeedTabIcon, HomeTabIcon, PlansTabIcon, WalletTabIcon } from '~/lib/assets/TabIcons/Tabicons';

const Tab = createBottomTabNavigator();

type Props = StackScreenProps<RootStackParamList, 'TabNavigator'>;

const AnimatedIcon = ({ focused, children }: { focused: boolean, children: React.ReactNode }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.spring(scaleValue, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      {children}
    </Animated.View>
  );
};

export default function TabLayout({ navigation }: Props) {
  const activeTabColor = "#41BCC4";

  const TabTitle = ({ focused, title }: { focused: boolean, title: string }) => (
    <View style={{ alignItems: 'center' }}>
      {focused ? (
        <ActiveTabDot width={12} height={15} color={activeTabColor} />
      ) : (
        <Text style={{ color: '#94A1AD' }}>{title}</Text>
      )}
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: activeTabColor,
        headerShown: false,
        tabBarStyle: {
          paddingTop: 10, // Add top padding to all tabs
          height: 90, // Increase the height to accommodate the padding
        },
      }}>
      <Tab.Screen
        name="One"
        component={One}
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Home" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <HomeTabIcon width={32} height={32} color={color} />
            </AnimatedIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Two"
        component={Two}
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Plans" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <PlansTabIcon width={32} height={32} color={color} />
            </AnimatedIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Three"
        component={Two}
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Wallet" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <WalletTabIcon width={32} height={32} color={color} />
            </AnimatedIcon>
          ),
        }}
      />
      <Tab.Screen
        name="Four"
        component={Two}
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Feed" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <FeedTabIcon width={22} height={22} color={color} />
            </AnimatedIcon>
          ),
        }}
      />
        <Tab.Screen
        name="Profile"
        component={Two}
        options={{
          tabBarLabel: ({ focused }) => <TabTitle focused={focused} title="Profile" />,
          tabBarIcon: ({ focused, color }) => (
            <AnimatedIcon focused={focused}>
              <Image source={require('../lib/assets/images/profile.png')} style={{width:32,height:32}} />
            </AnimatedIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
