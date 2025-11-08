import axios from "axios";
const getClass = async (Id_faculty) => {
  try {
    const response = await axios.get(
      `https://pbl6-backend.vercel.app/api/classes/faculty/${Id_faculty}/classes`
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
};
export default getClass;
