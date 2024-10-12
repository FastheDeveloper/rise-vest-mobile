import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const [loading, setLoading] = useState(false);

  // Check authentication status from storage
  const checkAuthStatus = async () => {
    try {
      const [token, expiresAt] = await Promise.all([
        getValueFor(STORAGE_KEYS.AUTH_TOKEN),
        getValueFor(STORAGE_KEYS.EXPIRES_AT),
      ]);

      // Determine if the token has expired
      const expiresAtDate = new Date(expiresAt || '');
      const hasExpired = new Date() > expiresAtDate;

      setIsAuthenticated(!!token && !hasExpired);
      setAuthToken(token);
    } catch (error) {
      setIsAuthenticated(false);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

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
        setHasBeenUsed,
        signIn,
        signUp,
        signOut,
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
