import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE = "http://192.168.1.13:3000/api";





const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const fetchSensorData = async () => {
  const response = await api.get('/sensors/latest');
  return response.data;
};

