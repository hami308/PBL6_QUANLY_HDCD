import axios from "axios";

const API_URL = "https://pbl6-backend-iy5q.onrender.com/api";

export async function askAnything(question) {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/chatbot/ask-anything`,
      { question },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ask Anything API Error:", error);
    return { success: false, message: "Không thể kết nối đến máy chủ." };
  }
}

export async function analyzeImage(imageFile) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(`${API_URL}/chatbot/analyze-image`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Analyze Image API Error:", error);
    return { success: false, message: "Không thể phân tích ảnh." };
  }
}

export async function getChatHistory(limit = 20, page = 1) {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/chatbot/history`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit, page },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get Chat History API Error:", error);
    return { success: false, message: "Không thể lấy lịch sử chat." };
  }
}
