import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { login as loginApi, register as registerAip} from '@/api/auth';
import type { User } from '@/types/bookmark';
export interface Credentials {
    username: string
    password: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = computed<User>(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });
    const login = async (info: Credentials): Promise<any> => {
        try {
            const response = await loginApi(info);
            // 保存 token 和用户信息
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response
        } catch (error) {
            throw error;
        } 
    }
    const register = async (info: Credentials): Promise<any> => {
        const response = await registerAip(info); 
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }
    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login';
    }
    return { logout,login,user,register}
})