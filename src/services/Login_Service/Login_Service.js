// src/services/authService.js
import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api/auth/login";

export async function login(username, password) {

  try {
    const response = await axios.post(`${API_URL}`, {
      username,
      password,
    });

    const data = response.data;

    if (data.success) {
      // Lưu thông tin user và token vào sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }
      console.log(data);
      return { success: true, user: data.user };
    } else {
      console.log(data);
      return { success: false, message: data.message || "Đăng nhập thất bại" };
      
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

export function logout() {
  sessionStorage.removeItem("user");
}
