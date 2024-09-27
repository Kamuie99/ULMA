import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  data: { accessToken: any; refreshToken: any; };
  accessToken: string;
  refreshToken: string;
  msg: string;
}

interface UserInfo {
  email: string;
  name: string;
  account: string | null;
  accountNumber: string | null;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  age: number;
}

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: (loginId: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  loadTokens: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: true,
  userInfo: null,

  login: async (loginId, password) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        loginId,
        password,
      });
      const {accessToken, refreshToken} = response.data;

      await Keychain.setGenericPassword(
        'tokens',
        JSON.stringify({accessToken, refreshToken}),
      );
      await AsyncStorage.setItem('token', accessToken);

      set({accessToken, refreshToken, isLoggedIn: true});

      // 로그인 후 사용자 정보 가져오기
      await get().fetchUserInfo();

      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem('token');
      set({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        userInfo: null,
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  loadTokens: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const {accessToken, refreshToken} = JSON.parse(credentials.password);
        await AsyncStorage.setItem('token', accessToken);
        set({accessToken, refreshToken, isLoggedIn: true});

        // 토큰 로드 후 사용자 정보 가져오기
        await get().fetchUserInfo();
      }
    } catch (error) {
      console.error('토큰 불러오기 실패:', error);
    }
  },

  setTokens: async (accessToken, refreshToken) => {
    await Keychain.setGenericPassword(
      'tokens',
      JSON.stringify({accessToken, refreshToken}),
    );
    await AsyncStorage.setItem('token', accessToken);
    set({accessToken, refreshToken, isLoggedIn: true});

    // 토큰 설정 후 사용자 정보 가져오기
    await get().fetchUserInfo();
  },

  fetchUserInfo: async () => {
    try {
      const response = await axiosInstance.get<UserInfo>('/user');
      set({userInfo: response.data});
      console.log('가져온 사용자 정보:', response.data);
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
    }
  },
}));

export default useAuthStore;
