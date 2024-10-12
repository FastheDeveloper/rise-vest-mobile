// Validate email address format using a regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate if the amount is a number
export const validateAmount = (amount: number | string): boolean => {
  return !isNaN(Number(amount)) && typeof Number(amount) === 'number';
};

// Check if all required fields are filled
interface UserDetails {
  email: string;
  password: string;
}

export const allFieldsFilled = (details: UserDetails): boolean => {
  // Ensure the email is valid and the password field is not empty
  return validateEmail(details.email) && details.password.trim() !== '';
};

// Handle blur event for email input field
export const handleEmailBlur = (email: string, setErrorMessage: (message: string) => void): void => {
  if (!validateEmail(email) && email.trim() !== '') {
    setErrorMessage('Invalid email address');
  } else {
    setErrorMessage('');
  }
};

// Handle blur event for amount input field
export const handleAmountBlur = (amount: number | string, setErrorMessage: (message: string) => void): void => {
  if (!validateAmount(amount)) {
    setErrorMessage('Invalid amount entered. Must be a number');
  } else {
    setErrorMessage('');
  }
};
