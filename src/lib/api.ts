import axios, { AxiosError } from 'axios';
import { tokenManager } from './cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ApiError {
  detail: string;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await apiClient.get<T>(endpoint);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    try {
      const response = await apiClient.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    try {
      const response = await apiClient.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response) {
      // Server responded with error status
      const message = axiosError.response.data?.detail || axiosError.message;
      const apiError = new Error(message);
      (apiError as any).status = axiosError.response.status;
      (apiError as any).data = axiosError.response.data;
      return apiError;
    } else if (axiosError.request) {
      // Request was made but no response received
      return new Error('Network error. Please check your connection.');
    }
  }
  // Unknown error
  return error instanceof Error ? error : new Error('An unexpected error occurred');
}
