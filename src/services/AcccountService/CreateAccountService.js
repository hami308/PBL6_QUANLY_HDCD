import axios from "axios";
export const createAccount = async ({ username, password, role }) => {
  if (!username || !password || !role) {
    throw new Error("Vui lòng điền đầy đủ thông tin!");
  }

  let validPw = password;
  if (validPw.length > 12) validPw = validPw.slice(0, 12);
  if (validPw.length < 6) {
    throw new Error("Mật khẩu phải từ 6 đến 12 ký tự!");
  }

  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token hết hạn!");
  }

  try {
    const response = await axios.post(
      "https://pbl6-backend-iy5q.onrender.com/api/auth/create-user",
      {
        username,
        password_hash: validPw,
        roleName: role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error.response?.data || error.message);
  }
};
