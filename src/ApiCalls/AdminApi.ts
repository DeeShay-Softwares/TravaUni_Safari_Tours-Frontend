import { adminApi } from "@/lib/apiClient";

const registerAdmins = async (data: object) => {
  const response = await adminApi.post("/register", data);

  return response;
};

const getAllAdmins = async () => {
  try {
    const response = await adminApi.get("/getAdmins");
    return response;
  } catch (error) {
    console.error("Error getting admins", error);
    throw error;
  }
};

const updateAdmin = async (id: string, adminData: object) => {
  try {
    const response = await adminApi.put(`/update/${id}`, adminData);
    return response.data;
  } catch (error) {
    console.error("Error on updating ", error);
    throw error;
  }
};

const deleteAdmin = async (id: string) => {
  const response = await adminApi.delete(`/delete/${id}`);
  return response.data;
};

const AdminServices = {
  registerAdmins,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};

export default AdminServices;
