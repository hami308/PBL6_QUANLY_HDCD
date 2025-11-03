// src/services/studentService.js
import axios from "axios";

const API_BASE_URL = "https://pbl6-backend.vercel.app/api/student-profiles"; 

//  Lấy thông tin sinh viên theo user_id
export const getStudentInfo = async (user_id) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sinh viên:", error);
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

// Cập nhật thông tin sinh viên
export const updateStudentInfo = async (studentData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/${studentData.id}`, studentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin sinh viên:", error);
    throw error;
  }
};
// Xóa hồ sơ sinh viên
export const deleteStudentProfile = async (studentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa hồ sơ sinh viên:", error);
    throw error;
  }
};
