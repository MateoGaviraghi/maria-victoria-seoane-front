import { apiClient } from '@/lib/api';
import { Category, Course, CreateCourseData, UpdateCourseData } from '@/types/course';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export const coursesService = {
  getCourses: async (params?: PaginationParams): Promise<PaginatedResponse<Course>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>('/courses', {
      params,
    });
    return data.data;
  },

  getCourseById: async (id: string, includeModules?: boolean): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/courses/${id}`, {
      params: { includeModules },
    });
    return data.data;
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/courses/slug/${slug}`);
    return data.data;
  },

  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const { data } = await apiClient.post<ApiResponse<Course>>('/courses', courseData);
    return data.data;
  },

  updateCourse: async (id: string, courseData: UpdateCourseData): Promise<Course> => {
    const { data } = await apiClient.put<ApiResponse<Course>>(`/courses/${id}`, courseData);
    return data.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },

  getFeaturedCourses: async (limit?: number): Promise<Course[]> => {
    const { data } = await apiClient.get<ApiResponse<Course[]>>('/courses/featured', {
      params: { limit },
    });
    return data.data;
  },

  togglePublish: async (id: string): Promise<Course> => {
    const { data } = await apiClient.patch<ApiResponse<Course>>(`/courses/${id}/toggle-publish`);
    return data.data;
  },

  toggleFeatured: async (id: string): Promise<Course> => {
    const { data } = await apiClient.patch<ApiResponse<Course>>(`/courses/${id}/toggle-featured`);
    return data.data;
  },

  reorderCourses: async (orderedIds: string[]): Promise<{ message: string }> => {
    const { data } = await apiClient.put<ApiResponse<{ message: string }>>(
      '/courses/reorder/batch',
      { orderedIds }
    );
    return data.data;
  },

  getCategories: async (params?: {
    includeCoursesCount?: boolean;
    onlyWithCourses?: boolean;
  }): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params,
    });
    return data.data;
  },
};
