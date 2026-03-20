import { API_CONFIG } from '@/configs/api.config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { baseURL, timeout } = API_CONFIG;

export const api = axios.create({
  baseURL: baseURL,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Interceptor para adicionar o token de autenticação em cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@appSG:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
