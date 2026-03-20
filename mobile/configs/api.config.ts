import Constants from 'expo-constants';

export const API_CONFIG = {
  baseURL: Constants.expoConfig?.extra?.apiBaseUrl,
  timeout: 5000,
};
