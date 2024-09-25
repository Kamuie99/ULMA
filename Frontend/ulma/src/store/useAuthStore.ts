import { create } from 'zustand';
import axiosInstance from '@/api/axios';
import * as Keychain from 'react-native-keychain'; // Keychain 모듈 불러오기

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
  loadTokens: () => Promise<void>; // 저장된 토큰을 불러오는 함수
}

const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,

  // 로그인 시 Keychain에 토큰 저장
  login: async (loginId, password) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        loginId,
        password,
      });
      const { accessToken, refreshToken } = response.data;

      // Keychain에 토큰 저장
      await Keychain.setGenericPassword('tokens', JSON.stringify({ accessToken, refreshToken }));

      set({ accessToken, refreshToken, isLoggedIn: true });
      return response.data;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  // 로그아웃 시 Keychain에서 토큰 삭제
  logout: async () => {
    try {
      await Keychain.resetGenericPassword();
      set({ accessToken: null, refreshToken: null, isLoggedIn: false });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  // 앱 시작 시 저장된 토큰을 불러옴
  loadTokens: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const { accessToken, refreshToken } = JSON.parse(credentials.password);
        set({ accessToken, refreshToken, isLoggedIn: true });
      }
    } catch (error) {
      console.error('토큰 불러오기 실패:', error);
    }
  },

  // 토큰을 Keychain에 저장하는 함수
  setTokens: async (accessToken, refreshToken) => {
    await Keychain.setGenericPassword('tokens', JSON.stringify({ accessToken, refreshToken }));
    set({ accessToken, refreshToken, isLoggedIn: true });
  },
}));

export default useAuthStore;
