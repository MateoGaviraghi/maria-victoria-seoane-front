import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/api';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalStudents: number;
  totalCourses: number;
  revenueGrowth: number;
  ordersGrowth: number;
  studentsGrowth: number;
}

interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },

  getSalesData: async (days: number = 30): Promise<SalesChartData[]> => {
    const { data } = await apiClient.get<ApiResponse<SalesChartData[]>>('/dashboard/sales', {
      params: { days },
    });
    return data.data;
  },
};
