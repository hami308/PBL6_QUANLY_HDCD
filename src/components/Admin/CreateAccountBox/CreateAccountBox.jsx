import { useState } from "react";
import "./CreateAccountBox.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validPw = password;
    if (username.trim() === "" || password.trim() === "" || role === "") {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (validPw.length > 12) validPw = validPw.slice(0, 12);
    if (validPw.length < 6) {
      alert("Mật khẩu phải từ 6 đến 12 ký tự!");
      return;
    }

    try {
      // 👉 Lấy token từ localStorage (sau khi đăng nhập)
      const token = localStorage.getItem("user");

      if (!token) {
        alert("Bạn chưa đăng nhập hoặc token hết hạn!");
        return;
      }

      // Gọi API tạo tài khoản
      const response = await axios.post(
        "https://pbl6-backend-iy5q.onrender.com/api/users", // đổi sang URL thật của bạn
        {
          username,
          password: validPw,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // gắn token vào header
            "Content-Type": "application/json",
          },
        }
      );

      alert("Tạo tài khoản thành công!");
      console.log("Response:", response.data);
      navigate("/permission", { state: { username, role } });
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      if (error.response?.status === 403) {
        alert("Bạn không có quyền tạo tài khoản!");
      } else if (error.response?.status === 401) {
        alert("Token không hợp lệ hoặc đã hết hạn!");
      } else {
        alert("Lỗi khi tạo tài khoản, vui lòng thử lại!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-account-form">
      <h2 className="form-title">Tạo 1 tài khoản</h2>

      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      <div className="form-group">
        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div className="form-group">
        <label>Vai trò</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Chọn vai trò --</option>
          <option value="student">Sinh viên</option>
          <option value="teacher">Giảng viên</option>
          <option value="staff">Nhân viên</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="submit-btn">
        <button type="submit">
          <span className="material-symbols-outlined">done_outline</span>
        </button>
      </div>

      <div className="note">
        <p>Lưu ý:</p>
        <ul>
          <li>
            Tài khoản sinh viên mặc định username và mật khẩu là mã số sinh viên
          </li>
          <li>Tài khoản cán bộ mặc định username và mật khẩu là mã cán bộ</li>
        </ul>
      </div>
    </form>
  );
};

export default CreateAccount;
