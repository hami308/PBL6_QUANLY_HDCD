import axios from "axios";
const API_URL = "https://pbl6-backend.vercel.app/api";
export const getClass = async () => {
  try {
    const response = await axios.get(`${API_URL}/classes`);
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
export const getClassesByFaculty = async (facultyId) => {
  try {
    if (!facultyId) throw new Error("Faculty ID không được để trống");

    const response = await axios.get(
      `${API_URL}/classes/faculty/${facultyId}/classes`
    );

    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
};
export const createClass = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/classes`, payload, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating class:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể tạo lớp. Vui lòng thử lại.",
    };
  }
};
export const updateClass = async (classId, payload) => {
  try {
    const response = await axios.put(`${API_URL}/classes/${classId}`, payload, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating class:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật lớp. Vui lòng thử lại.",
    };
  }
};
export const deleteClass = async (classId) => {
  try {
    const response = await axios.delete(`${API_URL}/classes/${classId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error deleting class:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể xóa lớp. Vui lòng thử lại.",
    };
  }
};
