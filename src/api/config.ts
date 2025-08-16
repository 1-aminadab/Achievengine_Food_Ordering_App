import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.62.223:3000/api',
  TIMEOUT: 10000,
};

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

export const apiClient = createAxiosInstance();

// Utility function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    data: response.data.data || response.data,
    message: response.data.message,
    success: true,
  };
};

// Utility function to handle API errors
export const handleApiError = (error: AxiosError): ApiError => {
  const response = error.response;
  
  return {
    message: (response?.data as any)?.message || error.message || 'An error occurred',
    status: response?.status,
    code: error.code,
  };
};