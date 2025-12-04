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
        error.response?.data?.messaage ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

export async function get_details_activity_by_id(id) {
  try {
    const response = await axios.get(`${API_URL}/activities/${id}`);
    console.log("response",response);
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

export async function filter_activities(filters) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/activities/filter`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Lọc hoạt động thành công.",
    };
  } catch (error) {
    console.error("Filter activities error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lọc hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function filter_activities_by_student(studentId,filters) {
  try {
    const token = sessionStorage.getItem("token");
    console.log("filters",filters);
    const response = await axios.get(`${API_URL}/activities/student/${studentId}/filter`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response filter",response);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || "Lọc hoạt động thành công.",
    };
  } catch (error) {
    console.error("Filter activities error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lọc hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function register_activity(activityId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/activities/${activityId}/register`,
      {}, 
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
      message: response.data.message || "Đăng ký tham gia hoạt động thành công!",
    };
  } catch (error) {
    console.error(`Register activity ${activityId} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể đăng ký tham gia hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function get_activity_details_of_student(activityId, studentId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/activities/${activityId}/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Lấy thông tin tham gia của sinh viên thành công.",
    };
  } catch (error) {
    console.error(`Get activity ${activityId} for student ${studentId} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin tham gia hoạt động của sinh viên, vui lòng thử lại sau.",
    };
  }
}

export async function update_activity(id, activityData) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(`${API_URL}/activities/${id}`,activityData,
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
      message: response.data.message || "Cập nhật hoạt động thành công!",
    };

  } catch (error) {
    console.error(`Update activity ${id} error:`, error);
    return {
    success: false,
    message:
    error.response?.data?.message ||
    "Không thể cập nhật hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function cancel_activity(activityId,reason) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(`${API_URL}/activities/${activityId}/cancel`,  {reason},
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
      message: response.data.message || "Hủy hoạt động thành công!",
    };
  } catch (error) {
    console.error(`Cancel activity ${activityId} error:`, error);
    return {
    success: false,
    message:
    error.response?.data?.message ||
    "Không thể hủy hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function get_registered_students(activityId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/activities/${activityId}/registrations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response",response);
    return {
      success: true,
      data: response.data, 
      message: response.data.message || "Lấy danh sách đăng ký thành công.",
    };
  } catch (error) {
    console.error(`Get registrations for activity ${activityId} error:`, error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách đăng ký, vui lòng thử lại sau.",
    };
  }
}

export async function approve_activity(activityId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/activities/${activityId}/approve`,
      {}, // body rỗng
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
      message: response.data.message || "Phê duyệt hoạt động thành công!",
    };
  } catch (error) {
    console.error(`Approve activity ${activityId} error:`, error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể phê duyệt hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function reject_activity(activityId, reason) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/activities/${activityId}/reject`,
      { reason }, 
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
      message: response.data.message || "Từ chối hoạt động thành công!",
    };
  } catch (error) {
    console.error(`Reject activity ${activityId} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể từ chối hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function get_students_stats_by_activity(activityId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/attendances/activity/${activityId}/students-stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response attendance",response);
    return {
      success: true,
      data: response.data, 
      message: response.data.message || "Lấy thống kê sinh viên tham gia thành công.",
    };
  } catch (error) {
    console.error(`Get student stats for activity ${activityId} error:`, error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thống kê sinh viên tham gia, vui lòng thử lại sau.",
    };
  }
}
