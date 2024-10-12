import * as SecureStore from 'expo-secure-store';

// Function to save a value associated with a key
export async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// Function to retrieve a value by key
export async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

// Function to delete a value associated with a key
export async function deleteKey(key) {
  await SecureStore.deleteItemAsync(key);
}
