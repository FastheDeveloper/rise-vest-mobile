import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { ActivityIndicator } from 'react-native';
import { getValueFor, save } from '~/lib/utils/secureStorage';
import { STORAGE_KEYS } from '~/core/constants/asyncKeys';
import { baseURL, createApiInstance } from '~/lib/hooks/useApi';
import { API_ROUTES } from '~/core/constants/apiRoutes';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios'; // Make sure to import AxiosError
import Toast from 'react-native-toast-message';

// Define the shape of the context

interface UserResponse {
  email_address: string;
  first_name: string;
  id: string;
  last_name: string;
  token: string;
  total_balance: number;
  total_returns: number;
  username: string | null;
}
interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  loading: boolean;
  hasBeenUsed: boolean;
  setHasBeenUsed: (value: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userSignup: UserDetails) => Promise<void>;
  signOut: () => Promise<void>;
  setIsAuthenticated: (value: boolean) => void;
  hasPin: boolean;
  setHasPin: (value: boolean) => void;
  setPin: (pin: string) => Promise<void>;
  refreshToken: () => Promise<string>;
  userResponse: UserResponse | null;
  quotes: Quote | null;
  userSignup: UserDetails | null;
  setUserSignup: (value: UserDetails) => void;
  rates: Rate | null;
  plans: Plans | null;
  authChecked: boolean;
  createPlan: ( planInfo: Plan) => Promise<void>;
  createdPlan: CreatedPlan | null;

}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface JWTPayload {
  exp: number;
  [key: string]: any; // Add other fields if necessary
}

interface Quote {
  author: string;
  quote: string;
}

interface UserDetails {
  email_address?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

interface Rate {
  buy_rate: number;
  sell_rate: number;
}

interface Plans {
  item_count: number;
  items: Plan[];
}

export interface Plan {
  id: string;
  plan_name: string;
  target_amount: number;
  plan_type: string;
  plan_duration: string;
  plan_start_date: string;
  plan_end_date: string;
  plan_status: string;
  plan_image: string;
}

 
interface CreatedPlan {
  created_at: string;
  id: string;
  invested_amount: number;
  maturity_date: string;
  plan_name: string;
  returns: any[];
  target_amount: number;
  total_returns: number;
  user_id: string;
}
function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [rates, setRates] = useState<Rate | null>(null);
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plans | null>(null);
  const [quotes, setQuotes] = useState<Quote | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [createdPlan, setCreatedPlan] = useState<CreatedPlan | null>(null);
  const [userSignup, setUserSignup] = useState<UserDetails>({
    email_address: '',
    password: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  const extractAndStoreExpiresAt = async (token: string) => {
    try {
      const payload: JWTPayload = jwtDecode(token);
      if (payload && payload.exp) {
        const expiresAt = new Date(payload.exp * 1000); // Convert to milliseconds
        await save(STORAGE_KEYS.EXPIRES_AT, expiresAt.toISOString());
      } else {
        console.error('No exp field found in JWT.');
      }
    } catch (error) {
      console.error('Error extracting expiration time:', error);
    }
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      const [token, expiresAtString] = await Promise.all([
        getValueFor(STORAGE_KEYS.AUTH_TOKEN),
        getValueFor(STORAGE_KEYS.EXPIRES_AT),
      ]);

      if (token && expiresAtString) {
        const expiresAt = new Date(expiresAtString);
        const hasExpired = new Date() > expiresAt;

        if (hasExpired) {
        
          signOut();
        } else {
          // Token is still valid
          console.log('token is still valid');
          setIsAuthenticated(true);
          console.log('token from checker', token);
          setAuthToken(token);
          await getUserSession(token);
          await getQuotes(token);
          await getRates(token);
          await getPlans(token);
        }
      } else {
        setIsAuthenticated(false);
        setAuthToken(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
      
        setAuthChecked(true);
      
    }
  }, []);

  const getUserSession = async (token: string) => {
    try {
      console.log(authToken, 'getting user session');
      const res = await axios.get(`${baseURL}${API_ROUTES.GET_SESSION}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('res', res.data);
      setUserResponse(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Get user session error:', error);
      setIsAuthenticated(false);
      setAuthToken(null);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const getQuotes = async (token: string) => {
    try {
      console.log(authToken, 'getting user session');
      const res = await axios.get(`${baseURL}${API_ROUTES.GET_QUOTE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('res quote', res.data);
      setQuotes(res.data);
    } catch (error) {
      console.error('Get user session error:', error);
      setIsAuthenticated(false);
      setAuthToken(null);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const getRates = async (token: string) => {
    try {
      console.log(authToken, 'getting user session');
      const res = await axios.get(`${baseURL}${API_ROUTES.GET_RATES}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('res quote', res.data);
      setRates(res.data);
    } catch (error) {
      console.error('Get user session error:', error);
      setIsAuthenticated(false);
      setAuthToken(null);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const getPlans = async (token: string) => {
    try {
      console.log(authToken, 'getting user session');
      const res = await axios.get(`${baseURL}${API_ROUTES.GET_PLANS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('res plans', res.data);
      setPlans(res.data);
    } catch (error) {
      console.error('Get user session error:', error);
      setIsAuthenticated(false);
      setAuthToken(null);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const createPlan = async (planInfo: Plan) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}${API_ROUTES.CREATE_PLAN}`, planInfo, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },  
      });
      console.log('Create plan response:', res.data);
      setCreatedPlan(res.data);
      if (authToken) {
        await getPlans(authToken);
      }
      Toast.show({
        type: 'success',
        text1: 'Plan Created',
        text2: 'Your new plan has been successfully created!'
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', axiosError.response.data);
          console.error('Error status:', axiosError.response.status);
          console.error('Error headers:', axiosError.response.headers);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('Error request:', axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', axiosError.message);
        }
        console.error('Error config:', axiosError.config);
      } else {
        // Non-Axios error
        console.error('Non-Axios error:', error);
      }
      // Don't set isAuthenticated to false or clear authToken for a 400 error
      // as it's likely a problem with the request, not authentication
      throw error; // Re-throw the error so it can be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  // Check if the app has been used before
  const checkBeenUsed = useCallback(async () => {
    try {
      const usedApp = await getValueFor(STORAGE_KEYS.HAS_APP_BEEN_USED);
      setHasBeenUsed(!!usedApp);
    } catch (err) {}
  }, []);

  const setPin = useCallback(async (pin: string) => {
    console.log('pin', pin);
    // setHasPin(true);
    await save(STORAGE_KEYS.HAS_PIN, pin);
  }, []);

  // Check if the user has a pin
  const checkHasPin = useCallback(async () => {
    try {
      const hasPin = await getValueFor(STORAGE_KEYS.HAS_PIN);
      console.log('hasPin', hasPin);
      setHasPin(!!hasPin);
    } catch (err) {}
  }, []);

  useEffect(() => {
    checkBeenUsed();
  }, [checkBeenUsed]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    checkHasPin();
  }, [checkHasPin]);

  // Dummy sign-in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const api = createApiInstance(baseURL, () => ({
        isAuthenticated,
        getAccessToken: () => authToken ?? '',
        refreshToken: async () => {
          return 'dummy_token_refresh';
        },
      }));
      const res = await api.post(`${API_ROUTES.SIGN_IN}`, {
        email_address: email,
        password: password,
      });
      setUserResponse(res.data);
      setIsAuthenticated(true);
      setAuthToken(res.data.token);
      await getQuotes(res.data.token);
      await getRates(res.data.token);
      await getPlans(res.data.token);
      await save(STORAGE_KEYS.AUTH_TOKEN, res.data.token);

      // Extract and store expiration time
      await extractAndStoreExpiresAt(res.data.token);

      Toast.show({
        type: 'success',
        text1: 'Sign In Successful',
        text2: 'Welcome back!'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: 'Please check your credentials and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const api = createApiInstance(baseURL, () => ({
      isAuthenticated: false,
      getAccessToken: () => authToken ?? '',
      refreshToken: async () => {
        // Implement your refresh token logic here
        // Return the new access token
        return 'dummy_token_refresh';
      },
    }));
    // const res = await api.post(`${API_ROUTES.REFRESH_TOKEN}`, {refresh_token: refreshToken})
    console.log('res');
    return 'dummy_token_refresh';
  };

  const signUp = async (userSignup: UserDetails) => {
    setLoading(true);

    try {
      const api = createApiInstance(baseURL, () => ({
        isAuthenticated,
        getAccessToken: () => authToken ?? '',
        refreshToken: async () => {
          return 'dummy_token_refresh';
        },
      }));
      await api.post(`${API_ROUTES.SIGN_UP}`, userSignup);
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
        text2: 'Your account has been created!'
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', axiosError.response.data);
          console.error('Error status:', axiosError.response.status);
          console.error('Error headers:', axiosError.response.headers);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('Error request:', axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', axiosError.message);
        }
        console.error('Error config:', axiosError.config);
      } else {
        // Non-Axios error
        console.error('Non-Axios error:', error);
      }
      
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: 'Please check your information and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Dummy sign-out function
  const signOut = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear all relevant state variables
      setIsAuthenticated(false);
      setAuthToken(null);
      setUserResponse(null);
      setRates(null);
      setPlans(null);
      setQuotes(null);
      setCreatedPlan(null);
      setUserSignup({
        email_address: '',
        password: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
      });

      // Clear stored token and expiration time
      await save(STORAGE_KEYS.AUTH_TOKEN, '');
      await save(STORAGE_KEYS.EXPIRES_AT, '');

      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'You have been successfully signed out.'
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign Out Failed',
        text2: 'There was an error signing out. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const api = useMemo(
    () =>
      createApiInstance('YOUR_BASE_URL', () => ({
        isAuthenticated,
        getAccessToken: () => authToken ?? '',
        refreshToken: async () => {
          // Implement your refresh token logic here
          // Return the new access token
          return 'dummy_token_refresh';
        },
      })),
    [isAuthenticated, authToken]
  );

  // if (isLoading) {
  //   return <ActivityIndicator />;
  // }

  // Provide auth context to children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        loading,
        hasBeenUsed,
        authChecked,
        hasPin,
        setHasPin,
        setHasBeenUsed,
        signIn,
        signUp,
        signOut,
        setIsAuthenticated,
        setPin,
        refreshToken,
        rates,
        userResponse,
        quotes,
        userSignup,
        plans,
        setUserSignup,
        createPlan,
        createdPlan
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
