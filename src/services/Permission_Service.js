
import axios from "axios";
const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function get_all_permission() {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get permission error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy được các quyền của hệ thống.",
    };
  }
}

export async function get_all_actions() {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/permissions/actions`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get permission error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy được các quyền của hệ thống.",
    };
  }
}

export async function get_user_permissions(userId) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/permissions/users/${userId}/permissions`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("User permissions:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get user permissions error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy được danh sách quyền của người dùng.",
    };
  }
}