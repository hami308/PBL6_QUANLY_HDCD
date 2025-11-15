import axios from "axios";
export const createAccount_Student = async ({
  username,
  password,
  roleName,
  full_name,
  class_id,
}) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token hết hạn!");
  }

  try {
    const response = await axios.post(
      "https://pbl6-backend-iy5q.onrender.com/api/auth/create-user",
      {
        username,
        password,
        roleName,
        full_name,
        class_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: response.data.success, message: response.data.message };
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error.response?.data || error.message);
    return error.response?.data || { success: false, message: error.message };
  }
};
export const createAccount_Staff = async ({
  username,
  password,
  roleName,
  full_name,
  org_unit_id,
  position,
}) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token hết hạn!");
  }

  try {
    const response = await axios.post(
      "https://pbl6-backend-iy5q.onrender.com/api/auth/create-user",
      {
        username,
        password,
        roleName,
        full_name,
        org_unit_id,
        position,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: response.data.success, message: response.data.message };
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error.response?.data || error.message);
    return error.response?.data || { success: false, message: error.message };
  }
};
