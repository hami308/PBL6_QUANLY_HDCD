import axios from "axios";

export const deleteAccount = async (iduser) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(
      `https://pbl6-backend.vercel.app/api/users/${iduser}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && response.data?.message) {
      console.log("Delete success:", response.data.message);
      return { success: true, message: response.data.message };
    } else {
      console.warn("Unexpected delete response:", response);
      return { success: false, message: "Xóa không thành công" };
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi server",
    };
  }
};
