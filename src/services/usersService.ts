import { apiClient } from '@/lib/api';
import { UpdateProfileData, User } from '@/types/user';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const usersService = {
  getMyProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/me');
    return data.data;
  },

  updateMyProfile: async (payload: UpdateProfileData): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>('/users/me', payload);
    return data.data;
  },

  getAllUsers: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', {
      params,
    });
    return data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}/role`, { role });
    return data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  activateUser: async (id: string): Promise<User> => {
    const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}/activate`);
    return data.data;
  },
};
