// src/services/userService.js
import axios from "axios";

const API_BASE = "https://pbl6-backend.vercel.app/api";

// Lấy token từ sessionStorage
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});

// Lấy danh sách sinh viên
export const getStudents = async () => {
  try {
    const res = await axios.get(
      `${API_BASE}/student-profiles`,
      getAuthHeader()
    );
    console.log("Response data:", res.data);
    return res.data.success ? res.data.data : [];
  } catch (err) {
    console.error(" Lỗi khi lấy danh sách sinh viên:", err);
    throw err;
  }
};

// Lấy danh sách giảng viên
export const getTeachers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/staff-profiles`, getAuthHeader());
    console.log("Response data:", res.data);
    return res.data ? res.data : [];
  } catch (err) {
    console.error("Lỗi khi lấy danh sách giảng viên:", err);
    throw err;
  }
};
