import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api";

export async function get_all_fields() {
  try {
    const response = await axios.get(`${API_URL}/fields`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get fields error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối đến server.",
    };
  }
}

export async function create_field(payload) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(`${API_URL}/fields`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Create field error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi tạo ngành học.",
    };
  }
}

export async function update_field(id, payload) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(`${API_URL}/fields/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Update field error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi cập nhật ngành học.",
    };
  }
}

export async function delete_field(id) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/fields/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Delete field error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi xóa ngành học.",
    };
  }
}
