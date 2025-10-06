import React, { useState } from "react";
import "./UpdatePassword.css";

const UpdatePassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 12) {
      setError("Mật khẩu phải dài từ 6 đến 12 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }
    setError("");
    // Xử lý cập nhật mật khẩu ở đây (gọi API, v.v.)
    alert("Cập nhật mật khẩu thành công!");
  };

  return (
    <div className="update-container">
      <h2 className="update-title">Cấp lại mật khẩu</h2>
      <p className="update-note">
        Lưu ý: Không đặt mật khẩu trùng ngày sinh và mật khẩu dài 6–12 ký tự
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="update-input"
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="update-input"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="update-input"
        />
        {error && <p className="update-note">{error}</p>}
        <button type="submit" className="update-btn">
          Lưu mật khẩu
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
