import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',
  withCredentials: true,
});

export default axiosInstance;
