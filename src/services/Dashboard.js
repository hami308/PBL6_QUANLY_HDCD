// src/services/Dashboard.js
import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api";
const getToken = () => sessionStorage.getItem("token");

export const getDashboardData = async (year) => {
  try {
    if (!year) {
      year = new Date().getFullYear(); // Mặc định năm hiện tại
    }

    const res = await axios.get(`${API_URL}/statistics/dashboard-by-year`, {
      params: { year },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    console.log(`Dashboard data for year ${year}:`, res.data);
    return res.data.data[0] || {};
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
