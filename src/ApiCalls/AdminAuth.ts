import axios from "axios";

const BASE_URL = "http://localhost:4000/auth";

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const login = async (username: string, password: string) => {
  try {
    const response = await authApi.post("/login", { username, password });
    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const logout = async (user: object | JSON) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found for logout");
      return { data: { success: false, message: "No token found" } };
    }

    const response = await authApi.post(
      "/logout",
      { user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

const AuthServices = {
  login,
  logout,
};

export default AuthServices;
