// lib/api-factory.ts
import axios from "axios";
import type {  AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { CONFIG } from "@/config";
import { useNavigate } from "react-router-dom";

 
// Core interceptor logic
const setupInterceptors = (instance: AxiosInstance) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
 
  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403 ) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
         const navigate = useNavigate();
        navigate("/hero",{replace: true})
      }
      return Promise.reject(error);
    }
  );
};

export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  setupInterceptors(instance);
  return instance;
};

export const tripApi = createApiClient(`${CONFIG.BACKEND_URL}/trips`);
export const travelerApi = createApiClient(`${CONFIG.BACKEND_URL}`);
export const authApi = createApiClient(`${CONFIG.BACKEND_URL}/auth`);
export const adminApi = createApiClient(`${CONFIG.BACKEND_URL}/admin`);
export const bookingApi = createApiClient(`${CONFIG.BACKEND_URL}/`);
export const adminDashboardApi = createApiClient(`${CONFIG.BACKEND_URL}/api`);
export const paymentApi = createApiClient(`${CONFIG.BACKEND_URL}/payments`);