// src/services/studentService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/students"; // 🔧 đổi theo URL backend thật

// 🟢 Lấy thông tin sinh viên theo MSSV
export const getStudentInfo = async (mssv) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${mssv}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sinh viên:", error);
    throw error;
  }
};

// 🟡 Cập nhật thông tin sinh viên
export const updateStudentInfo = async (studentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${studentData.mssv}`, studentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin sinh viên:", error);
    throw error;
  }
};
