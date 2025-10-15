import React, { useState } from "react";
import "./Login.css";
import login_pic from "../../assets/images/login_pic.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/Login_Service/Login_Service.js";

function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ trước khi đăng nhập

    try {
      const result = await login(username, password); // ✅ CHỜ API PHẢN HỒI

      if (result.success) {
        onClose();
        alert(`Đăng nhập thành công! Chào mừng ${result.user.name}`);

        // Chuyển hướng theo role
        if (result.user.role === "student") {
          navigate("/home-student", { replace: true });
        } else if (result.user.role === "admin") {
          navigate("/home-admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Có lỗi xảy ra khi kết nối tới server.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">Đăng nhập</h2>

        <div className="modal-content">
          <img src={login_pic} alt="login" className="login-icon" />

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
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
