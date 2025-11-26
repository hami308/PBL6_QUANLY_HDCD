import axios from "axios";

const API_BASE_URL = "https://pbl6-backend.vercel.app/api/pvcd-records";
export const getAllRecord = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("ket qua ", response);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin hoạt động :", error);
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
export const score_dashboard = async () => {
  try {
    const url = "https://pbl6-backend.vercel.app/api/statistics/grades";
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin hoạt động :", error);
    throw error;
  }
};
