import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignupData {
  name: string;
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  genderDigit: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  msg: string;
}

interface AuthStore {
  signupData: SignupData;
  setSignupData: (data: Partial<SignupData>) => void;
  isPhoneVerified: boolean;
  setPhoneVerified: (verified: boolean) => void;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUserId: (userId: string | null) => void;
  login: (loginId: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const useAuthStore = create<AuthStore>(set => ({
  signupData: {
    name: '',
    loginId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    genderDigit: '',
  },
  setSignupData: data =>
    set(state => ({signupData: {...state.signupData, ...data}})),
  isPhoneVerified: false,
  setPhoneVerified: verified => set({isPhoneVerified: verified}),
  accessToken: null,
  refreshToken: null,
  userId: null,
  setAccessToken: token => set({accessToken: token}),
  setRefreshToken: token => set({refreshToken: token}),
  setUserId: userId => set({userId}),
  isLoggedIn: false,
  login: async (loginId, password) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        loginId,
        password,
      });
      const {accessToken, refreshToken, msg} = response.data;
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
      set({
        accessToken: null,
        refreshToken: null,
        userId: null,
        isLoggedIn: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
