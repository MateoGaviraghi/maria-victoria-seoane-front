import { apiClient } from '@/lib/api';
import {
  ChangePasswordData,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  User,
} from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/login', credentials);
    return data.data;
  },

  register: async (
    userData: RegisterData
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
    >('/auth/register', userData);
    return data.data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data.user;
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>('/users/me', profileData);
    return data.data;
  },

  changePassword: async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/change-password',
      passwordData
    );
    return data.data;
  },

  resendVerificationEmail: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/resend-verification'
    );
    return data.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
      token,
    });
    return data.data;
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    return data.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      { token, newPassword }
    );
    return data.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },
};
