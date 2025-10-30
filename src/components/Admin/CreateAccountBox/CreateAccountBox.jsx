import { useState } from "react";
import "./CreateAccountBox.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Gọi API tạo tài khoản
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const token = sessionStorage.getItem("token"); // 🔹 Lấy token đã lưu khi đăng nhập

    if (!token) {
      setMessage("Bạn cần đăng nhập bằng tài khoản admin để tạo tài khoản!");
      return;
    }

    try {
      const response = await axios.post(
        "https://pbl6-backend.vercel.app/api/auth/register",
        {
          username,
          password,
          roleName: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.data.success) {
        const per = window.confirm(
          "Tạo tài khoản thành công! Bạn có muốn phân quyền hay không ?"
        );
        if (per) {
          navigate("/permission", { state: { username, role } });
        } else {
          setUsername("");
          setPassword("");
          setRole("");
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      if (error.response) {
        setMessage(error.response.data.message || "Lỗi khi gọi API!");
      } else {
        setMessage("Không thể kết nối tới máy chủ!");
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
          <option value="" disabled>
            -- Chọn vai trò --
          </option>
          <option value="student">Sinh viên</option>
          <option value="teacher">Giảng viên</option>
          <option value="staff">Nhân viên</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {message && <p className="error">{message}</p>}
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
