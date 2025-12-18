import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/Login_Service/Login_Service.js";

function Login({ onClose }) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!role || !username || !password) {
    setError("Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  try {
    const result = await login(username, password, role);

    if (!result?.success) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      return;
    }

    const userRoles = result.user?.roles || [];

    // 👉 kiểm tra quyền
    const matchedRole = userRoles.find((r) => r.role === role);

    if (!matchedRole) {
      setError("Tài khoản của bạn không có quyền truy cập với vai trò này.");
      return;
    }

    // ✅ LƯU ROLE ĐANG ĐĂNG NHẬP
    sessionStorage.setItem("role", role);

    // ✅ NẾU LÀ STAFF → LƯU THÊM DỮ LIỆU
    if (role === "staff") {
      if (matchedRole.orgUnit?.id) {
        sessionStorage.setItem(
          "orgUnitId",
          matchedRole.orgUnit.id
        );
      }
     
    }

    onClose?.();

    switch (role) {
      case "student":
        navigate("/home-student", { replace: true });
        break;
      case "staff":
        navigate("/home-staff", { replace: true });
        break;
      case "admin":
        navigate("/home-admin", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    setError("Có lỗi xảy ra khi kết nối tới server.");
  }
};

  return (
    <div className="modal-login-overlay">
      <div className="modal-login">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-login-title">Đăng nhập</h2>

        <div className="modal-login-content">
          <span className="material-symbols-outlined">passkey</span>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-login-group">
              <label>Vai trò:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Sinh viên</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div className="form-login-group">
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-login-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="login-btn">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
