import axios from "axios";

const API_URL =  "https://pbl6-backend-iy5q.onrender.com/api";

export async function askAnything(question) {
  const token = sessionStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/chatbot/ask-anything`,
      { question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ask Anything API Error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể kết nối đến máy chủ.",
    };
  }
}

export async function analyzeImage(imageFile) {
  const token = sessionStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `${API_URL}/chatbot/analyze-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Analyze Image API Error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Không thể phân tích ảnh, vui lòng thử lại.",
    };
  }
}