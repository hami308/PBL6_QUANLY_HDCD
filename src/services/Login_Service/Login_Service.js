// src/services/authService.js
import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api/auth/login"; // ⚠️ Thay bằng URL thật

export async function login(username, password) {
  if (!username || !password) {
    return { success: false, message: "Vui lòng nhập đầy đủ thông tin" };
  }

  try {
    const response = await axios.post(`${API_URL}`, {
      username,
      password,
    });

    const data = response.data;

    if (data.success) {
      // Lưu thông tin user vào sessionStorage (có thể lưu token)
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
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
