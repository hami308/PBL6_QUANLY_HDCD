
import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api/auth";

export async function change_password({ old_password, new_password, confirm_password }) {
     if (!old_password || !new_password || !confirm_password) {
    return { success: false, message: "Vui lòng nhập đầy đủ thông tin" };
  }
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/change-password`,
      {
        oldPassword:old_password,
        newPassword:new_password,
        confirmPassword:confirm_password,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response)
    return response;
  } catch (error) {
    console.error("Change password error:", error);
    console.log("Server response:", error.response?.data);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

