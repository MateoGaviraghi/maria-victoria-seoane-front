import { apiClient } from '@/lib/api';
import { EmailConfig, EmailLog, EmailStats, EmailType, UpdateEmailConfigData } from '@/types/email';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const emailsService = {
  getEmailLogs: async (params?: PaginationParams): Promise<PaginatedResponse<EmailLog>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<EmailLog>>>('/emails/logs', {
      params,
    });
    return data.data;
  },

  getEmailStats: async (): Promise<EmailStats> => {
    const { data } = await apiClient.get<ApiResponse<EmailStats>>('/emails/stats');
    return data.data;
  },

  sendTestEmail: async (payload: { to: string; type: EmailType }) => {
    const { data } = await apiClient.post<ApiResponse<unknown>>('/emails/test', payload);
    return data.data;
  },

  getEmailConfig: async (): Promise<EmailConfig> => {
    const { data } = await apiClient.get<ApiResponse<EmailConfig>>('/site-config/emails/settings');
    return data.data;
  },

  updateEmailConfig: async (configData: UpdateEmailConfigData): Promise<EmailConfig> => {
    const { data } = await apiClient.put<ApiResponse<EmailConfig>>(
      '/site-config/emails/settings',
      configData
    );
    return data.data;
  },
};
