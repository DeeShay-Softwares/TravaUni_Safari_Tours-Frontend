import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return error instanceof Error && 
         'response' in error && 
         (error as AxiosError).response?.status === 401;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

export const getDataFromResponse = (error: unknown): Record<string, unknown> | null => {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    
    if (err.response && typeof err.response === 'object' && 'data' in err.response) {
      const response = err.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        return response.data as Record<string, unknown>;
      }
    }
    
    if ('data' in err && err.data && typeof err.data === 'object') {
      return err.data as Record<string, unknown>;
    }
    
    return err;
  }
  
  return null;
};