import { authApi } from "@/lib/apiClient";

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
