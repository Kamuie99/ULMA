import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios';

const baseURL = process.env.VITE_API_URL || 'http://j11e204.p.ssafy.io/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터에서 AsyncStorage로 토큰 가져오기
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        // 디버깅: 토큰 출력
        // console.log('Sending request with token:', token);
      }
      return config;
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;