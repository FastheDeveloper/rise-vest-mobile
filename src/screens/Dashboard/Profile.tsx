import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';

const Profile: React.FC = () => {
  const { userResponse, signOut } = useAuth();
  const handleSignout = async () => {
    try {
      signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="mb-5 text-2xl font-bold">Profile</Text>
      {userResponse && (
        <View className="mb-8 items-center">
          <Text className="mb-1 text-lg font-bold">
            {userResponse.first_name} {userResponse.last_name}
          </Text>
          <Text className="text-base text-gray-600">
            {userResponse.email_address}
            {userResponse.total_balance}
          </Text>
        </View>
      )}
      <TouchableOpacity className="rounded-md bg-red-500 px-5 py-2.5" onPress={handleSignout}>
        <Text className="text-base font-bold text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
