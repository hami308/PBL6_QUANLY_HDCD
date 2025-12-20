import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api/auth/bulk-import-students";

export const uploadBulkUsers = async (students) => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw { message: "Chưa đăng nhập hoặc token không tồn tại" };
    }

    console.log("📤 Uploading students:", students);

    const res = await axios.post(
      API_URL,
      { students }, // ✅ ĐÚNG FORMAT BACKEND
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📥 Server response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Upload bulk users error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Có lỗi xảy ra khi import sinh viên",
      }
    );
  }
};
