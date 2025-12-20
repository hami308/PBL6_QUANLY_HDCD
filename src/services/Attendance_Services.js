import axios from "axios";
const API_URL = "https://pbl6-backend-iy5q.onrender.com/api"; 
export async function get_attendance_by_idstudent(idstudent) {
  try {
    const token = sessionStorage.getItem("token");
     const response = await axios.get(`${API_URL}/attendances/student/${idstudent}/activities`, {
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

export async function submit_feedback(attendanceId, feedbackData) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/attendances/${attendanceId}/submit-feedback`,
      feedbackData,
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
    console.error(`Submit feedback for attendance ${attendanceId} error:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể gửi phản hồi, vui lòng thử lại sau.",
    };
  }
}

export async function get_attendance_detail(studentId, activityId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/attendances/student/${studentId}/activity/${activityId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error(
      `Get attendance detail for student ${studentId} activity ${activityId} error:`,
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể lấy chi tiết điểm danh, vui lòng thử lại sau.",
    };
  }
}

export async function generate_qr(qrData) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/attendances/generate-qr`,
      qrData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Generate QR response:", response.data);
    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error("Generate QR error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể tạo QR điểm danh, vui lòng thử lại sau.",
    };
  }
}

export async function update_attendance(attendanceId, updateData) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/attendances/${attendanceId}`,
      updateData,
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
    console.error(`Update attendance ${attendanceId} error:`, error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật điểm danh, vui lòng thử lại sau.",
    };
  }
}