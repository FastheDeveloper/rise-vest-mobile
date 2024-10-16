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
  const [planInfo, setPlanInfo] = useState({
    plan_name: '',
    target_amount: 0,
    maturity_date: '',
  });
  const [amountValid, setAmountValid] = useState(false);

  const questions = [
    { label: 'What are you saving for?', state: goalName, setState: setGoalName },
    { label: 'How much do you need?', state: edittedAmount, setState: setEdittedAmount },
    { label: 'When do you want to withdraw?', state: targetDate, setState: setTargetDate },
  ];

  const currentQuestionData = questions[currentQuestion - 1];

  const formatCurrency = (value: string) => {
    return currency(value || 0, { precision: 2, symbol: '' }).format();
  };

  const handleAmountChange = (text: string) => {
    const numericAmount = parseFloat(text.replace(/[^0-9.]/g, ''));
    setEdittedAmount(text);
    setTargetAmount(isNaN(numericAmount) ? '' : numericAmount.toString());
    setAmountValid(numericAmount > 50);
    setPlanInfo((prevState) => ({
      ...prevState,
      target_amount: isNaN(numericAmount) ? 0 : numericAmount,
    }));
    setErrorMessage('');
    setShowError(false);
  };

  const handleBlurFormat = () => {
    const numericAmount = handleAmountBlur(edittedAmount, setErrorMessage);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const formattedAmount = formatCurrency(numericAmount.toString());
      setTargetAmount(numericAmount.toString());
      setEdittedAmount(formattedAmount);
      setAmountValid(numericAmount > 50);
    } else {
      setAmountValid(false);
    }
    setShowError(true);
  };

  const handleInputFocus = () => {
    setEdittedAmount('');
    setTargetAmount('');
    setErrorMessage('');
    setShowError(false);
    setAmountValid(false);
  };

  useEffect(() => {
    setPlanInfo((prevState) => ({
      ...prevState,
      plan_name: goalName,
    }));
  }, [goalName]);

  useEffect(() => {
    setPlanInfo((prevState) => ({
      ...prevState,
      maturity_date: targetDate,
    }));
  }, [targetDate]);

  const taskCreatedDate = (date: any) => {
    const convertDate = new Date(date.timestamp);
    console.log(convertDate);
    const formattedDate = convertDate.toISOString().split('T')[0];
    setTargetDate(formattedDate);
    closeModal();
  };

  function OpenCalendarModal() {
    const today = new Date();
    const oneYearFromToday = new Date(today.setFullYear(today.getFullYear() + 1));
    const defaultDate = targetDate || oneYearFromToday.toISOString().split('T')[0];

    openModal?.(
      <CalendarModal
        onDateSelected={taskCreatedDate}
        closeModal={closeModal}
        currentDate={defaultDate}
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
      console.log('Plan Info:', planInfo);

      navigation.navigate('PlanReview', { planInfo });
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
              className="h-12 flex-1 text-base"
              value={currentQuestionData.state}
              onChangeText={currentQuestionData.setState}
              rightIcon={<Calendar width={24} height={24} />}
              editable={false}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <InputField
        className="h-12 flex-1 text-base"
        value={currentQuestionData.state}
        onChangeText={currentQuestion === 2 ? handleAmountChange : currentQuestionData.setState}
        leftIcon={currentQuestion === 2 ? <Naira width={24} height={24} /> : undefined}
        keyboardType={currentQuestion === 2 ? 'numeric' : 'default'}
        onBlur={currentQuestion === 2 ? handleBlurFormat : undefined}
        onFocus={currentQuestion === 2 ? handleInputFocus : undefined}
      />
    );
  };

  return (
    <KeyboardAwareScrollView className="bg-white ">
      <SafeAreaView className="flex-1 bg-white ">
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity onPress={handleBack} className="mb-2">
            <Back width={36} height={36} />
          </TouchableOpacity>
          <Text className="font-spaceg-semibold text-2xl">{getHeaderTitle()}</Text>
          <View />
        </View>

        <View className="flex-1 p-4">
          <Text className="mb-8 px-2 font-dmsans-semibold text-xl text-[#71879C]">
            Question {currentQuestion} of 3
          </Text>
          <View className="mx-2 mb-6 h-[10px] rounded-full bg-gray-200">
            <View
              className="h-[10px] rounded-full bg-teal-500 px-2"
              style={{ width: `${(currentQuestion / 3) * 100}%` }}
            />
          </View>

          <Text className="mb-2 mt-12 px-2 font-dmsans-semibold text-xl">
            {currentQuestionData.label}
          </Text>
          {renderInput()}
          {errorMessage && showError && currentQuestion === 2 && (
            <Text className="mt-2 px-2 text-sm text-red-500">{errorMessage}</Text>
          )}
          <View className="my-4" />
          <AppButton
            label="Continue"
            disabled={!currentQuestionData.state || (currentQuestion === 2 && !amountValid)}
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
});

export default PlanDetain;
