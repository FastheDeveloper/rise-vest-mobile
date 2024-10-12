import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { APP_COLOR } from '~/src/core/constants/colorConstants';
import { FONT_NAMES } from '~/src/core/constants/fontConstants';

// InputField component with optional icons and password visibility toggle
const InputField = ({ leftIcon, label, rightIcon, ...inputProps }) => {
  const [hide, setHide] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, isFocused && styles.selectedField]}>
        {leftIcon && (
          <View style={styles.leftIcon} testID="left-icon">
            <FontAwesome name={leftIcon} size={16} color={APP_COLOR.MAIN_GREY_TEXT} />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            rightIcon || inputProps.secureTextEntry
              ? styles.inputWithRightIcon
              : styles.inputFullWidth,
          ]}
          {...inputProps}
          placeholderTextColor={APP_COLOR.LIGHT_GREY}
          secureTextEntry={inputProps.secureTextEntry && !rightIcon ? hide : undefined}
          onFocus={() => {
            setIsFocused(true);
            if (inputProps.onFocus) inputProps.onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);

            if (inputProps.onBlur) inputProps.onBlur();
          }}
          autoCapitalize="none"
        />

        {(rightIcon || inputProps.secureTextEntry) && (
          <View style={styles.rightIcon}>
            <Pressable onPress={() => (rightIcon ? null : setHide(!hide))} testID="passwordTest">
              <FontAwesome
                name={
                  rightIcon ||
                  (inputProps.secureTextEntry && (hide ? 'eye' : 'eye-slash')) ||
                  undefined
                }
                size={20}
                color={APP_COLOR.MAIN_GREY}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '2%',
  },
  label: {
    fontSize: 16,
    fontFamily: FONT_NAMES.INTER_MEDIUM,
    marginVertical: 4,
    color: APP_COLOR.MAIN_GREY,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: APP_COLOR.MAIN_WHITE,
    width: '100%',
    marginTop: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: APP_COLOR.LIGHT_GREY,
    paddingLeft: '2%',
  },
  leftIcon: {
    marginLeft: 8,
  },
  input: {
    height: 52,
    paddingHorizontal: '2%',
    color: APP_COLOR.MAIN_DARK,
    fontFamily: FONT_NAMES.INTER_MEDIUM,
  },
  inputFullWidth: {
    width: '100%',
  },
  inputWithRightIcon: {
    width: '85%',
  },
  rightIcon: {
    marginRight: 8,
    paddingHorizontal: '2%',
  },
  selectedField: {
    borderColor: APP_COLOR.MAIN_GREEN,
  },
});
