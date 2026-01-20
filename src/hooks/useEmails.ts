'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emailsService } from '@/services/emailsService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { PaginationParams } from '@/types/api';
import { EmailType, UpdateEmailConfigData } from '@/types/email';

export const useEmailLogs = (params?: PaginationParams) => {
  const {
    data: logsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['email-logs', params],
    queryFn: () => emailsService.getEmailLogs(params),
  });

  return {
    logs: logsData?.data || [],
    meta: logsData
      ? {
          total: logsData.total,
          page: logsData.page,
          limit: logsData.limit,
          totalPages: logsData.totalPages,
        }
      : undefined,
    isLoading,
    error,
  };
};

export const useEmailConfig = () => {
  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['email-config'],
    queryFn: () => emailsService.getEmailConfig(),
  });

  return { config, isLoading, error };
};

export const useUpdateEmailConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmailConfigData) => emailsService.updateEmailConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-config'] });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useEmailStats = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['email-stats'],
    queryFn: () => emailsService.getEmailStats(),
  });

  return { stats, isLoading, error };
};

export const useSendTestEmail = () => {
  return useMutation({
    mutationFn: (payload: { to: string; type: EmailType }) => emailsService.sendTestEmail(payload),
    onSuccess: () => {
      toast.success('Email de prueba enviado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
