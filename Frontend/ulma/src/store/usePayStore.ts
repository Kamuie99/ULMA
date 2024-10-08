import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import useAuthStore from './useAuthStore';

interface AccountInfo {
  accountNumber: string | null;
  bankCode: string | null;
}

interface PayInfo {
  balance: number | null;
}

interface PayStore extends AccountInfo, PayInfo {
  getAccountInfo: () => Promise<void>;
  makeAccount: () => Promise<void>;
  setAccountInfo: (data: Partial<AccountInfo>) => void;
  setPayInfo: (data: Partial<PayInfo>) => void; // PayInfo 업데이트 메서드 추가
  getPayInfo: () => Promise<void>;
}

const usePayStore = create<PayStore>(set => ({
  accountNumber: null,
  bankCode: null,
  balance: null,

  setAccountInfo: (data: Partial<AccountInfo>) =>
    set(state => ({
      ...state, // 현재 상태를 유지하면서 업데이트
      accountNumber: data.accountNumber ?? state.accountNumber,
      bankCode: data.bankCode ?? state.bankCode,
    })),

  setPayInfo: (
    data: Partial<PayInfo>, // PayInfo 설정 메서드 구현
  ) =>
    set(state => ({
      ...state,
      balance: data.balance ?? state.balance,
    })),

  getAccountInfo: async () => {
    try {
      const {accessToken} = useAuthStore.getState();
      const response = await axiosInstance.get<AccountInfo>(
        '/users/account/info',
        {
          headers: {Authorization: `Bearer ${accessToken}`},
        },
      );
      usePayStore.getState().setAccountInfo(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('계좌 정보를 불러오는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },

  makeAccount: async () => {
    try {
      const {accessToken} = useAuthStore.getState();
      const response = await axiosInstance.post<AccountInfo>('/users/pay', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      usePayStore.getState().setAccountInfo(response.data);
    } catch (error) {
      console.error('계좌 생성을 하는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },

  getPayInfo: async () => {
    const {accessToken} = useAuthStore.getState();
    try {
      const response = await axiosInstance.get<PayInfo>('/users/pay/balance', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      set(state => ({
        ...state,
        balance: response.data.balance,
      }));
    } catch (error) {
      console.error('pay 정보를 불러오는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },
}));

export default usePayStore;
