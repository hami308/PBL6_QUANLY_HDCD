import axios from "axios";
const API_URL = "https://pbl6-backend.vercel.app/api"; 
export async function get_attendance_by_idstudent(idstudent) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/attendances/student/${idstudent}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
    });
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