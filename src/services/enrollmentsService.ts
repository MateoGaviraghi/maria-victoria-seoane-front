import { apiClient } from '@/lib/api';
import { Enrollment, LessonProgress, UpdateLessonProgressData } from '@/types/enrollment';
import { ApiResponse } from '@/types/api';

export const enrollmentsService = {
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const { data } = await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments/my');
    return data.data;
  },

  getEnrollmentById: async (id: string): Promise<Enrollment> => {
    const { data } = await apiClient.get<ApiResponse<Enrollment>>(`/enrollments/${id}`);
    return data.data;
  },

  updateLessonProgress: async (
    enrollmentId: string,
    progressData: UpdateLessonProgressData
  ): Promise<LessonProgress> => {
    const { data } = await apiClient.patch<ApiResponse<LessonProgress>>(
      `/enrollments/${enrollmentId}/progress`,
      progressData
    );
    return data.data;
  },
};
