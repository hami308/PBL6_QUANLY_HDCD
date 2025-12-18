import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api";
const token = sessionStorage.getItem("token");
export async function get_all_org() {
  try {
    const response = await axios.get(`${API_URL}/org-units`);
    return {
      success: true,
      data: response.data,
    };
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

export async function get_org_unit_by_id(orgUnitId) {
  try {
    const response = await axios.get(`${API_URL}/org-units/${orgUnitId}`);
    console.log("response", response);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get org unit by ID error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}
export async function create_org_unit(payload) {
  try {
    const response = await axios.post(
      `${API_URL}/org-units`,
      {
        name: payload.name,
        founded_date: payload.founded_date,
        description: payload.description,
        achievements: payload.achievements,
        leader_id: payload.leader_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Create org unit error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi tạo đơn vị tổ chức, vui lòng thử lại.",
    };
  }
}

export async function update_org_unit(orgUnitId, payload) {
  try {
    const response = await axios.put(
      `${API_URL}/org-units/${orgUnitId}`,
      payload, // gửi đúng các field FE thay đổi
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Update org unit error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi cập nhật đơn vị tổ chức, vui lòng thử lại.",
    };
  }
}
