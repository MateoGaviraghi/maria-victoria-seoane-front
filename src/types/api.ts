export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
