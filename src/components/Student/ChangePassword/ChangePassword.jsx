import React, { useState } from "react";
import "./ChangePassword.css";

function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    // Kiểm tra các trường
    if (!oldPass || !newPass || !reNewPass) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Giả lập kiểm tra mật khẩu cũ
    if (oldPass !== "123456") {
      setMessage("Mật khẩu cũ không đúng!");
      return;
    }

    // Kiểm tra độ dài
    if (newPass.length < 6 || newPass.length > 12) {
      setMessage("Mật khẩu mới phải dài từ 6 đến 12 ký tự!");
      return;
    }

    // Kiểm tra trùng khớp
    if (newPass !== reNewPass) {
      setMessage("Mật khẩu nhập lại không khớp!");
      return;
    }

    // Thành công
    setMessage(" Mật khẩu đã được thay đổi thành công (demo).");
    setIsSuccess(true);

    // Reset form
    setOldPass("");
    setNewPass("");
    setReNewPass("");
  };

  return (
    <div className="change-password-background">
      <div className="change-password-container">
        <h2 className="change-password-note-title">Đổi mật khẩu</h2>
        <p className="change-password-note">
          Lưu ý: Không đặt mật khẩu trùng ngày sinh và mật khẩu dài 6 đến 12 ký tự.
        </p>

        <form className="change-password-form" onSubmit={handleSubmit}>
          <label>Mật khẩu cũ</label>
          <input
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />

          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            value={reNewPass}
            onChange={(e) => setReNewPass(e.target.value)}
          />

          {/* Hiển thị thông báo */}
          {message && (
            <div
              className={`bottom-message ${isSuccess ? "success" : "error"}`}
            >
              {message}
            </div>
          )}

          <div className="change-password-button-container">
            <button type="submit" className="change-password-button">
              Lưu mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
