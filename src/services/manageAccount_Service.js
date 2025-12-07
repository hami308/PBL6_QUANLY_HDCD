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

    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách giảng viên:", err);
    throw err;
  }
};
const BASE_URL = "https://pbl6-backend.vercel.app/api/student-profiles";

const getToken = () => sessionStorage.getItem("token");

export const filterStudents = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      student_number: filters.student_number || "",
      faculty_id: filters.faculty_id || "",
      class_id: filters.class_id || "",
    });

    const url = `${BASE_URL}?${query.toString()}`;
    console.log("Filter URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const json = await res.json();

    // 🟢 LẤY ĐÚNG TRƯỜNG data
    if (json.success) {
      console.log("Filtered Students:", json.data);
      return json.data;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Lỗi lọc sinh viên:", err);
    throw err;
  }
};
const STAFF_URL = "https://pbl6-backend.vercel.app/api/staff-profiles";

export const filterTeachers = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      staff_number: filters.staff_number || "",
      org_unit_id: filters.org_unit_id || "",
    });

    const url = `${STAFF_URL}?${query.toString()}`;
    console.log("Filter Teacher URL:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const json = await res.json();

    // Trả về đúng list giảng viên
    if (json.success) {
      console.log("Filtered Teachers:", json.data);
      return json.data;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Lỗi lọc giảng viên:", err);
    throw err;
  }
};
