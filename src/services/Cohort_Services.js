// Cohort_Service.js
import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api";
const token = sessionStorage.getItem("token");

export async function get_all_cohort() {
  try {
    const response = await axios.get(`${API_URL}/cohorts`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi server",
    };
  }
}

export async function create_cohort(payload) {
  try {
    const response = await axios.post(`${API_URL}/cohorts`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi tạo khóa học",
    };
  }
}

export async function update_cohort(id, payload) {
  try {
    const response = await axios.put(`${API_URL}/cohorts/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi cập nhật khóa học",
    };
  }
}

export async function delete_cohort(id) {
  try {
    const response = await axios.delete(`${API_URL}/cohorts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi xóa khóa học",
    };
  }
}
