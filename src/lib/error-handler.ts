import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    return new AppError(
      apiError?.message || 'Ocurrió un error inesperado',
      apiError?.statusCode || error.response?.status || 500
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('Ocurrió un error inesperado');
};

export const getErrorMessage = (error: unknown): string => {
  const appError = handleApiError(error);
  return appError.message;
};
