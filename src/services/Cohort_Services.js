import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function get_all_cohort() {
  try {
    const response = await axios.get(`${API_URL}/cohorts`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get cohort error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

