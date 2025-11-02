import axios from "axios";
const handleUpdatePassword = async (username, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(
      "https://pbl6-backend.vercel.app/api/auth/admin-update-password",
      { username, newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    if (error.response) {
      return {
        success: error.response.data?.success ?? false,
        message: error.response.data?.message || `Lỗi ${error.response.status}`,
      };
    }

    return {
      success: false,
      message: "Không thể kết nối đến server.",
    };
  }
};

export default handleUpdatePassword;
