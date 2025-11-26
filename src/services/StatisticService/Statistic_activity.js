import axios from "axios";
const activiti_dashboard = async () => {
  try {
    const url =
      "https://pbl6-backend.vercel.app/api/statistics/activity-dashboard";
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
export { activiti_dashboard };
