import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import useAuthStore from './useAuthStore';

interface AccountInfo {
  accountNumber: string | null;
  balance: number | null;
  bankCode: string | null;
}

interface PayStore extends AccountInfo {
  getAccountInfo: () => Promise<void>; // 반환 타입을 Promise<void>로 수정
  makeAccount: () => Promise<void>; // 반환 타입을 Promise<void>로 수정
}

const usePayStore = create<PayStore>(set => ({
  accountNumber: null,
  balance: null,
  bankCode: null,

  getAccountInfo: async () => {
    try {
      const {accessToken} = useAuthStore.getState(); // useAuthStore는 함수 내부에서 호출해야 함

      const response = await axiosInstance.get<AccountInfo>(
        '/users/pay/balance',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data;

      // 상태를 업데이트
      set({
        accountNumber: data.accountNumber,
        balance: data.balance,
        bankCode: data.bankCode,
      });
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
      set({
        accountNumber: data.accountNumber,
        balance: data.balance,
        bankCode: data.bankCode,
      });
    } catch (error) {
      console.error('계좌 생성을 하는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },
}));

export default usePayStore;
