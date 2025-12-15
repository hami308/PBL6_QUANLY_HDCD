import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api/auth/create-bulk-users";
const token = sessionStorage.getItem("token");
export const uploadBulkUsers = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Có lỗi xảy ra" };
  }
};
