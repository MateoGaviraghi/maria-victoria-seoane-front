'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '@/services/coursesService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';
import { CreateCourseData, UpdateCourseData } from '@/types/course';
import { PaginationParams } from '@/types/api';

export const useCourses = (params?: PaginationParams) => {
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesService.getCourses(params),
  });

  return {
    courses: coursesData?.data || [],
    meta: coursesData
      ? {
          total: coursesData.total,
          page: coursesData.page,
          limit: coursesData.limit,
          totalPages: coursesData.totalPages,
        }
      : undefined,
    isLoading,
    error,
  };
};

export const useCourse = (id: string, includeModules?: boolean) => {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourseById(id, includeModules),
    enabled: !!id,
  });

  return { course, isLoading, error };
};

export const useCourseBySlug = (slug: string) => {
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', 'slug', slug],
    queryFn: () => coursesService.getCourseBySlug(slug),
    enabled: !!slug,
  });

  return { course, isLoading, error };
};

export const useFeaturedCourses = (limit?: number) => {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses', 'featured', limit],
    queryFn: () => coursesService.getFeaturedCourses(limit),
  });

  return { courses: courses || [], isLoading, error };
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CreateCourseData) => coursesService.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso creado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
      coursesService.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      toast.success('Curso actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useTogglePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesService.togglePublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Estado de publicación actualizado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useToggleFeaturedCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesService.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Estado de destacado actualizado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useReorderCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) => coursesService.reorderCourses(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Cursos reordenados');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useCategories = (params?: {
  includeCoursesCount?: boolean;
  onlyWithCourses?: boolean;
}) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories', params],
    queryFn: () => coursesService.getCategories(params),
  });

  return { categories: categories || [], isLoading, error };
};
