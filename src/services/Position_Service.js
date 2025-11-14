import axios from "axios";
import { BsEar } from "react-icons/bs";

export async function get_all_position() {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      "https://pbl6-backend.vercel.app/api/staff-profiles/positions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get activities error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}
