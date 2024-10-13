import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Back, Calendar, Naira } from '~/lib/assets/svgs/Svgs';
import InputField from '~/lib/components/InputField';
import AppButton from '~/lib/components/AppButton';
import { handleAmountBlur } from '~/lib/utils/fieldValidators';
import currency from 'currency.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withModal } from '~/providers/modalService';
import { CalendarModal } from '~/lib/components/Calendar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';

const PlanDetain = withModal(({ openModal, closeModal }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [edittedAmount, setEdittedAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const questions = [
    { label: 'What are you saving for?', state: goalName, setState: setGoalName },
    { label: 'How much do you need?', state: edittedAmount, setState: setEdittedAmount },
    { label: 'When do you want to withdraw?', state: targetDate, setState: setTargetDate },
  ];

  const currentQuestionData = questions[currentQuestion - 1];

  const formatCurrency = (value: string) => {
    return currency(value || 0, { precision: 2, symbol: '' }).format();
  };

  // Format amount on blur and show error
  const handleBlurFormat = () => {
    const numericAmount = handleAmountBlur(edittedAmount, setErrorMessage);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const formattedAmount = formatCurrency(numericAmount.toString());
      setTargetAmount(formattedAmount);
      setEdittedAmount(formattedAmount);
    }
    setShowError(true);
  };

  // Clear error message and hide error on input focus
  const handleInputFocus = () => {
    setEdittedAmount(targetAmount.replace(/,/g, ''));
    setErrorMessage('');
    setShowError(false);
  };
  // Handle date change from calendar modal
  const taskCreatedDate = (date: any) => {
    const convertDate = new Date(date.timestamp);
    console.log(convertDate);
    const formattedDate = convertDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    setTargetDate(formattedDate);
    closeModal();
  };

  function OpenCalendarModal() {
    const today = new Date().toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    openModal?.(
      <CalendarModal
        onDateSelected={taskCreatedDate}
        closeModal={closeModal}
        currentDate={targetDate || today}
      />,
      {
        transparent: true,
        animationType: 'none',
      }
    );
  }

  const getHeaderTitle = () => {
    switch (currentQuestion) {
      case 1:
        return 'Goal name';
      case 2:
        return 'Target amount';
      case 3:
        return 'Target date';
      default:
        return 'New Goal';
    }
  };

  const handleNext = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Log all answers after the last question
      console.log('Goal Name:', goalName);
      console.log('Target Amount:', targetAmount);
      console.log('Target Date:', targetDate);
      navigation.navigate('PlanReview');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleInputPress = () => {
    if (currentQuestion === 3) {
      OpenCalendarModal();
    }
  };

  const renderInput = () => {
    if (currentQuestion === 3) {
      return (
        <TouchableWithoutFeedback onPress={handleInputPress}>
          <View pointerEvents="box-only">
            <InputField
              className="flex-1 h-12 text-base"
              value={currentQuestionData.state}
              onChangeText={currentQuestionData.setState}
              rightIcon={<Calendar width={24} height={24}/>}
              editable={false}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <InputField
        className="flex-1 h-12 text-base"
        value={currentQuestionData.state}
        onChangeText={currentQuestionData.setState}
        leftIcon={currentQuestion === 2 ? <Naira width={24} height={24}/> : undefined}
        keyboardType={currentQuestion === 2 ? 'numeric' : 'default'}
        onBlur={currentQuestion === 2 ? handleBlurFormat : undefined}
        onFocus={currentQuestion === 2 ? handleInputFocus : undefined}
      />
    );
  };

  return (
    <KeyboardAwareScrollView className="bg-white ">
    <SafeAreaView className="flex-1 bg-white ">
      <View className="p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={handleBack} className="mb-2">
          <Back  width={36} height={36} />
        </TouchableOpacity>
        <Text className="text-2xl font-spaceg-semibold">{getHeaderTitle()}</Text>
        <View />
      </View>

      <View className="flex-1 p-4">
        <Text className="text-xl font-dmsans-semibold text-[#71879C] mb-8 px-2">Question {currentQuestion} of 3</Text>
        <View className="h-[10px] bg-gray-200 rounded-full mb-6 mx-2">
          <View 
            className="h-[10px] bg-teal-500 rounded-full px-2" 
            style={{ width: `${(currentQuestion / 3) * 100}%` }} 
          />
        </View>

        <Text className="text-xl font-dmsans-semibold mt-12 mb-2 px-2">{currentQuestionData.label}</Text>
        {renderInput()}
        {errorMessage && showError && currentQuestion === 2 && (
          <Text className="text-red-500 text-sm mt-2 px-2">{errorMessage}</Text>
        )}
        <View className='my-4'/>
        <AppButton
          label="Continue"
          disabled={!currentQuestionData.state || (currentQuestion === 2 && !!errorMessage)}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
    </KeyboardAwareScrollView>
  );
});

export default PlanDetain;
