import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { STORAGE_KEYS } from '../../core/constants/asyncKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteKey, save } from '~/lib/utils/secureStorage';

const Profile: React.FC = () => {
  const { userResponse,setIsAuthenticated, } = useAuth();
  const handleSignout = async () => {
    try {
      setIsAuthenticated(false);
      // Clear the storage keys
      await deleteKey(
        STORAGE_KEYS.AUTH_TOKEN,
     
      );
      await deleteKey(
        STORAGE_KEYS.EXPIRES_AT,
      );

      // Clear the user state

    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-2xl font-bold mb-5">Profile</Text>
      {userResponse && (
        <View className="items-center mb-8">
          <Text className="text-lg font-bold mb-1">{userResponse.first_name} {userResponse.last_name}</Text>
          <Text className="text-base text-gray-600">{userResponse.email_address}{userResponse.total_balance}</Text>
        </View>
      )}
      <TouchableOpacity 
        className="bg-red-500 px-5 py-2.5 rounded-md"
        onPress={handleSignout}
      >
        <Text className="text-white font-bold text-base">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
