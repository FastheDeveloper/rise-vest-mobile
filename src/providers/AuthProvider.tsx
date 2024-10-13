import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { getValueFor, save } from '~/lib/utils/secureStorage';
import { STORAGE_KEYS } from '~/core/constants/asyncKeys';

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  loading: boolean;
  hasBeenUsed: boolean;
  setHasBeenUsed: (value: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setIsAuthenticated: (value: boolean) => void;
  hasPin: boolean;
  setHasPin: (value: boolean) => void;
  setPin: (pin: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const [token, expiresAt] = await Promise.all([
        getValueFor(STORAGE_KEYS.AUTH_TOKEN),
        getValueFor(STORAGE_KEYS.EXPIRES_AT),
      ]);

      // Determine if the token has expired
      const expiresAtDate = expiresAt ? new Date(expiresAt) : new Date();
      const hasExpired = new Date() > expiresAtDate;

      setIsAuthenticated(!!token && !hasExpired);
      setAuthToken(token);
    } catch (error) {
      setIsAuthenticated(false);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setAuthToken('dummy_token');
    setLoading(false);
  };

  // Dummy sign-up function
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setAuthToken('dummy_token');
    setLoading(false);
  };

  // Dummy sign-out function
  const signOut = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(false);
    setAuthToken(null);
    setLoading(false);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  // Provide auth context to children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        loading,
        hasBeenUsed,
        hasPin,
        setHasPin,
        setHasBeenUsed,
        signIn,
        signUp,
        signOut,
        setIsAuthenticated,
        setPin,
      }}
    >
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
