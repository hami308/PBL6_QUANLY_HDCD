import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function get_feedback_by_activity(id_activity) {
  try {
    const response = await axios.get(`${API_URL}/feedback/activity/${id_activity}`);
    console.log("rp",response);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get feedback error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

export async function create_feedback(data) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/feedback`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error("Create feedback error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}
