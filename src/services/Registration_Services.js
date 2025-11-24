import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function cancel_registration(id) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/registrations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error cancel registration:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Có lỗi xảy ra",
    };
  }
}