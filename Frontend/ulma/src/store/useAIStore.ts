import {create} from 'zustand';
import axiosInstance from '@/api/axios';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase('weightDB.db');

interface AIInfo {
  recommendation: number | null; // 추천 금액
  relationship: number | null; // 친밀도
  recommendationReceived: boolean; // 추천을 받았는지 여부
}

interface AIStore extends AIInfo {
  setAIInfo: (data: Partial<AIInfo>) => void;
  saveTransactionData: (actualAmount: number) => Promise<void>;
}

const useAIStore = create<AIStore>(set => ({
  recommendation: null,
  relationship: null,
  recommendationReceived: false, // 기본 상태 추가

  setAIInfo: (data: Partial<AIInfo>) =>
    set(state => ({
      ...state,
      recommendation: data.recommendation ?? state.recommendation,
      relationship: data.relationship ?? state.relationship,
      recommendationReceived:
        data.recommendationReceived ?? state.recommendationReceived,
    })),

  saveTransactionData: async (actualAmount: number) => {
    try {
      const {recommendation, relationship, recommendationReceived} =
        useAIStore.getState();

      // 트랜잭션 저장 SQL 실행
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO transactions (recommendation, actualAmount, relationship, usedRecommendation) VALUES (?, ?, ?, ?);',
          [
            recommendation,
            actualAmount,
            relationship,
            recommendationReceived ? 1 : 0,
          ],
          () => {
            console.log('거래 데이터가 성공적으로 저장되었습니다.');
          },
          (_, error) => {
            console.error(
              '거래 데이터를 저장하는 중 에러가 발생했습니다:',
              error,
            );
            return false; // 트랜잭션 실패 처리
          },
        );
      });
    } catch (error) {
      console.error('거래 데이터를 저장하는 중 에러가 발생했습니다:', error);
      throw error;
    }
  },
}));

export default useAIStore;
