import axios from "axios";

const API_URL = "https://pbl6-backend-iy5q.onrender.com/api/pvcd-records"; 

export async function get_all_activities() {
  try {
    const response = await axios.get(`${API_URL}/activities`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get pvcd error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

export async function get_pvcd_by_idstudent(idstudent) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/student/${idstudent}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Get pvcd ${idstudent} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}