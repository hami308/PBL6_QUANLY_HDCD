import axios from "axios";

const API_URL = "https://pbl6-backend-iy5q.onrender.com/api";

export async function create_post(formData) {
  const token = sessionStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/posts`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create post error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}
