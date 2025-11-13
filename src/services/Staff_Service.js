// src/services/studentService.js
import axios from "axios";

const API_BASE_URL = "https://pbl6-backend.vercel.app/api/staff-profiles/user";
export const getStaffInfo = async (_id) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("ket qua ", response);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin staff:", error);
    if (error.response) {
      console.error(" Response data:", error.response.data);
      console.error(" Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ server:", error.request);
    } else {
      console.error("Lỗi khi tạo request:", error.message);
    }

    throw error;
  }
};

// Cập nhật thông tin staff
export const updateStaffInfo = async (staffData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/${staffData._id}`,
      staffData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin sinh viên:", error);
    return null;
  }
};
// Xóa hồ sơ sinh viên
export const deleteStaffProfile = async (staffId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa hồ sơ sinh viên:", error);
    throw error;
  }
};
