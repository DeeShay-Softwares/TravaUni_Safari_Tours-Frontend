// ApiCalls/AdminDashboard.ts
import axios, { AxiosError } from "axios";
import { ApiError } from "../types";

const API_URL = "http://localhost:4000/api";

class AdminDashboardApi {
  async getDashboardData(token: string) {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      // Check if it's an Axios error
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;

        // Get status code and message
        const statusCode = axiosError.response?.status || 500;
        const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to fetch dashboard";
        const data = axiosError.response?.data;

        // 👇 THROW the ApiError
        throw new ApiError(message, statusCode, data);
      }

      // For non-axios errors
      throw new ApiError("An unknown error occurred", 500);
    }
  }

  async getProfile(token: string) {
    try {
      const response = await axios.get(`${API_URL}/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 👇 THROW ApiError with status code
        throw new ApiError(
          error.response?.data?.message || "Failed to fetch profile",
          error.response?.status || 500,
          error.response?.data,
        );
      }
      throw new ApiError("Unknown error", 500);
    }
  }
}

export default new AdminDashboardApi();
