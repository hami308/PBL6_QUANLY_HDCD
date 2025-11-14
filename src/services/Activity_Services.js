import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function get_all_activities() {
  try {
    const response = await axios.get(`${API_URL}/activities`);
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

export async function get_details_activity_by_id(id) {
  try {
    const response = await axios.get(`${API_URL}/activities/${id}`);
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get activity ${id} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}
export async function get_activities_by_idstudent(idstudent) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/activities/student/${idstudent}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get activity ${idstudent} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function create_activity(activityData) {
  try {
    const token = sessionStorage.getItem("token");

    // Gửi request POST đến API tạo hoạt động
    const response = await axios.post(
      `${API_URL}/activities`,
      activityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Tạo hoạt động thành công!",
    };
  } catch (error) {
    console.error("Create activity error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể tạo hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function propose_activity(activityData) {
  try {
    const token = sessionStorage.getItem("token");

    // Gửi request POST đến API tạo hoạt động
    const response = await axios.post(
      `${API_URL}/activities/suggest`,
      activityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Tạo hoạt động thành công!",
    };
  } catch (error) {
    console.error("Create activity error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể tạo hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function get_activities_by_orgunit(org_unit_id) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(`${API_URL}/activities`, {
      params: { org_unit_id }, 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "",
    };
  } catch (error) {
    console.error(`Get activities by org_unit_id (${org_unit_id}) error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách hoạt động theo đơn vị tổ chức, vui lòng thử lại sau.",
    };
  }
}

export async function get_activities_by_orgunit_and_status(org_unit_id, status) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(`${API_URL}/activities`, {
      params: { org_unit_id, status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Lấy danh sách hoạt động theo tổ chức và trạng thái thành công.",
    };
  } catch (error) {
    console.error(`Get activities by org_unit_id (${org_unit_id}) and status (${status}) error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách hoạt động theo đơn vị và trạng thái, vui lòng thử lại sau.",
    };
  }
}
