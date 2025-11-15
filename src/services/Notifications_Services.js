import axios from "axios";
const API_URL = "https://pbl6-backend.vercel.app/api"; 
export async function get_notifications(iduser) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get notifications ${iduser} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông báo, vui lòng thử lại sau.",
    };
  }
}

export async function read_all_notifications() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/notifications/read-all`,
      {}, // body rỗng
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Read all notifications error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể đánh dấu tất cả thông báo, vui lòng thử lại sau.",
    };
  }
}
