import axios from "axios";

const API_URL = "https://pbl6-backend.vercel.app/api"; 

export async function get_all_evidences() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/evidences`,{
        headers: { Authorization: `Bearer ${token}` }
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get evidence error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Lỗi kết nối đến server, vui lòng thử lại sau.",
    };
  }
}

export async function get_details_evidence_by_id(id) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/evidences/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data.data,
    };
    
  } catch (error) {
    console.error(`Get evidence ${id} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function get_evidence_by_idstudent(idstudent) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/evidences/student/${idstudent}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    console.error(`Get evidence ${idstudent} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy thông tin hoạt động, vui lòng thử lại sau.",
    };
  }
}

export async function submit_evidence(evidenceData) {
  try {
    const token = sessionStorage.getItem("token");
    // Gửi request tạo minh chứng mới
    const response = await axios.post(
      `${API_URL}/evidences`,
      evidenceData,
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
    };
  } catch (error) {
    console.error("Create evidence error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể nộp minh chứng, vui lòng thử lại sau.",
    };
  }
}
export async function update_evidence(id, updatedData) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/evidences/${id}`,
      updatedData,
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
    };
  } catch (error) {
    console.error(`Update evidence ${id} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật minh chứng, vui lòng thử lại sau.",
    };
  }
}
export async function get_evidences_by_class(classId) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/evidences/class/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Get evidences by class ${classId} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách minh chứng theo lớp, vui lòng thử lại sau.",
    };
  }
}

export async function approve_evidence(id, approveData) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(`${API_URL}/evidences/${id}/approve`, approveData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Approve evidence ${id} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Không thể duyệt minh chứng, vui lòng thử lại sau.",
    };
  }
}

export async function get_evidences_by_faculty(facultyId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/evidences/faculty/${facultyId}`,
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
    console.error(`Get evidences by faculty ${facultyId} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách minh chứng theo khoa, vui lòng thử lại sau.",
    };
  }
}

export async function get_my_approved_evidences(studentId) {
  try {
    const token = sessionStorage.getItem("token");

    if (!studentId) {
      throw new Error("studentId is required");
    }

    const response = await axios.get(
      `${API_URL}/evidences/approved/${studentId}`,
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
    console.error("Get approved evidences error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy danh sách minh chứng đã duyệt.",
    };
  }
}