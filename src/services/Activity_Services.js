import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function get_all_activities() {
  try {
    const response = await axios.get(`${API_URL}/activities`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get activities error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

export async function get_details_activity_by_id(id) {
  try {
    const response = await axios.get(`${API_URL}/activities/${id}`);
    console.log(response);
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get activity ${id} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}
export async function get_activities_by_idstudent(idstudent) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/activities/student/${idstudent}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get activity ${idstudent} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}