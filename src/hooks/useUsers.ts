'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { PaginationParams } from '@/types/api';

export const useAllUsers = (params?: PaginationParams) => {
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAllUsers(params),
  });

  return {
    users: usersData?.data || [],
    meta: usersData
      ? {
          total: usersData.total,
          page: usersData.page,
          limit: usersData.limit,
          totalPages: usersData.totalPages,
        }
      : undefined,
    isLoading,
    error,
  };
};

export const useUser = (id: string) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });

  return { user, isLoading, error };
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersService.updateUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
