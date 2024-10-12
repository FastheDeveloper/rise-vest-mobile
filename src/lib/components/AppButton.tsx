import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, PressableProps, TextStyle, ViewStyle } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { APP_COLOR } from '~/core/constants/colorConstants';
import { FONT_NAMES } from '~/core/constants/fontConstants';

// import { APP_COLOR } from '~core/constants/colorConstants';
// import { FONT_NAMES } from '~/src/core/constants/fontConstants';


// Custom button component with support for loading state and optional icons
interface AppButtonProps extends PressableProps {
  loading?: boolean;
  leftIcon?: React.ComponentProps<typeof FontAwesome5>['name'];
  label: string;
  rightIcon?:  React.ComponentProps<typeof FontAwesome5>['name'];
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AppButton: React.FC<AppButtonProps> = ({ 
  loading, 
  leftIcon, 
  label, 
  rightIcon, 
  style, 
  textStyle, 
  ...pressableProps 
}) => {
  // Render content based on loading state
  const content = loading ? (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator size="small" color={textStyle?.color || 'white'} animating={true} />
    </View>
  ) : (
    <>
      {leftIcon && (
        <View style={styles.leftIcon}>
          <FontAwesome5 name={leftIcon} size={20} color={textStyle?.color} />

        </View>
      )}
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
      {rightIcon && (
        <View style={styles.rightIcon}>
          <FontAwesome5 name={rightIcon} size={20} color={textStyle?.color} />
        </View>
      )}
    </>
  );

  return (
    <Pressable
      style={[
        styles.button,
        pressableProps.disabled ? styles.disabled : styles.enabled,
        style
      ]}
      {...pressableProps}>
      {content}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: '2%',
  },
  buttonText: {
    color: APP_COLOR.MAIN_WHITE,
    fontSize: 16,
    fontFamily: FONT_NAMES.DMSANS_BOLD,
    textAlign: 'center',
  },
  loaderWrapper: {
    height: 24,
    justifyContent: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
  },
  leftIcon: {
    position: 'absolute',
    left: 20,
  },
  enabled: {
    backgroundColor: APP_COLOR.MAIN_GREEN,
  },
  disabled: {
    backgroundColor: '#A9CABC',
  },
});
