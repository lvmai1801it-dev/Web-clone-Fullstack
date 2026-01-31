import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types';
import { User } from '@/lib/types';

export interface LoginResponse {
    token: string;
    user: User;
}

export const AuthService = {
    /**
     * Login
     * POST /user/login
     */
    login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
        const response = await axiosInstance.post<unknown, ApiResponse<LoginResponse>>('/user/login', { email, password });

        // If login successful, save token to localStorage
        if (response.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    },

    /**
     * Register
     * POST /user/register
     */
    register: async (data: Partial<User> & { password?: string }): Promise<ApiResponse<User>> => {
        return axiosInstance.post('/user/register', data);
    },

    /**
     * Get User Profile
     * GET /user/profile
     */
    getProfile: async (): Promise<ApiResponse<User>> => {
        return axiosInstance.get('/user/profile');
    },

    /**
     * Logout
     * POST /user/logout
     */
    logout: async (): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<unknown, ApiResponse<void>>('/user/logout');

        // Clear local storage regardless of backend response
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        return response;
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
