import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api/staff-profiles";

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

export async function create_position(payload) {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(`${API_URL}/positions`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Create position error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi tạo chức vụ.",
    };
  }
}

export async function update_position(id, payload) {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/positions/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Update position error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi cập nhật chức vụ.",
    };
  }
}

export async function delete_position(id) {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/positions/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Delete position error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa chức vụ.",
    };
  }
}
