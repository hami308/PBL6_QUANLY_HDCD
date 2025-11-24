import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api";
const token = sessionStorage.getItem("token");
// Lấy tất cả khoa
export async function get_all_faculties() {
  try {
    const response = await axios.get(`${API_URL}/faculties`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get faculty error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

// Tạo khoa mới
export async function create_faculty(payload) {
  try {
    const response = await axios.post(`${API_URL}/faculties`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Create faculty response:", response);
    if (response.data) return { success: true, data: response.data };
  } catch (error) {
    throw error.response?.data || { message: "Lỗi server" };
  }
}

// Cập nhật khoa
export async function update_faculty(id, payload) {
  try {
    const response = await axios.put(`${API_URL}/faculties/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi server" };
  }
}

// Xóa khoa
export async function delete_faculty(id) {
  try {
    const response = await axios.delete(`${API_URL}/faculties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Lỗi server" };
  }
}
