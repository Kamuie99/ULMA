import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  msg: string;
}

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  login: (loginId: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

const useAuthStore = create<AuthStore>(set => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  login: async (loginId, password) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        loginId,
        password,
      });
      const {accessToken, refreshToken} = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      set({accessToken, refreshToken, isLoggedIn: true});
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      set({accessToken: null, refreshToken: null, isLoggedIn: false});
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
  setTokens: async (accessToken, refreshToken) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    set({accessToken, refreshToken, isLoggedIn: true});
  },
}));

export default useAuthStore;
