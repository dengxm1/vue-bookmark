import request from './request';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
  };
}

// 用户注册
export const register = (data: RegisterData): Promise<AuthResponse> => {
  return request.post('/auth/register', data);
};

// 用户登录
export const login = (data: LoginData): Promise<AuthResponse> => {
  return request.post('/auth/login', data);
};