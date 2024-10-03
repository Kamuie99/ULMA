import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import useAuthStore from './useAuthStore';

interface AccountInfo {
  accountNumber: string | null;
  balance: number | null;
  bankCode: string | null;
}

interface PayStore extends AccountInfo {
  getAccountInfo: () => Promise<void>;
  makeAccount: () => Promise<void>;
  setAccountInfo: (data: Partial<AccountInfo>) => void;
}

const usePayStore = create<PayStore>(set => ({
  accountNumber: null,
  balance: null,
  bankCode: null,

  setAccountInfo: (data: Partial<AccountInfo>) =>
    set(state => ({
      accountNumber: data.accountNumber || state.accountNumber,
      balance: data.balance || state.balance,
      bankCode: data.bankCode || state.bankCode,
    })),

  getAccountInfo: async () => {
    try {
      const {accessToken} = useAuthStore.getState();

      const response = await axiosInstance.get<AccountInfo>(
        '/users/pay/balance',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data;
      usePayStore.getState().setAccountInfo(data);
    } catch (error) {
      console.error('계좌 정보를 불러오는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },

  makeAccount: async () => {
    try {
      console.log('hi');
      const {accessToken} = useAuthStore.getState();

      const response = await axiosInstance.post<AccountInfo>('/users/pay', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response);
      const data = response.data;

      usePayStore.getState().setAccountInfo(data);
    } catch (error) {
      console.error('계좌 생성을 하는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },

  getHistory: async () => {
    try {
      console.log('hi');
      const {accessToken} = useAuthStore.getState();

      const response = await axiosInstance.post<AccountInfo>('/users/pay', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response);
    } catch (error) {
      console.error('페이 이력 불러오기 실패', error);
      throw error;
    }
  },
}));

export default usePayStore;
