import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 后端 API 地址
  timeout: 10000,
  withCredentials: true // 允许携带 cookie
});

// 请求拦截器 - 自动添加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401 ||error.response?.status === 403) {
      ElMessage.error(error.response?.data?.error ||error.response?.data?.message);
      localStorage.removeItem('token');
      setTimeout(()=>{
        window.location.href = '/login';
      }, 2000)
    } else {
      ElMessage.error(error.response?.data?.error || error.response?.data?.message||'网络错误');
    }
    return Promise.reject(error);
  }
);

export default request;