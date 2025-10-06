import React, { useState } from "react";
import "./ChangePassword.css";

function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oldPass || !newPass || !reNewPass) {
      alert("Vui lòng điền đầy đủ các trường!");
      return;
    }
    if (newPass.length < 6 || newPass.length > 12) {
      alert("Mật khẩu mới phải dài từ 6 đến 12 ký tự!");
      return;
    }
    if (newPass !== reNewPass) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }
    alert("Mật khẩu đã được thay đổi (demo).");
    // Gửi request đến backend ở đây
  };

  return (
    <div className="change-password-background">
      <div className="change-password-container">
        <h1 className="change-password-title">Đổi mật khẩu</h1>
        <p className="change-password-note">
          Lưu ý: Không đặt mật khẩu trùng ngày sinh và mật khẩu dài 6 đến 12 ký tự
        </p>

        <form className="change-password-form" onSubmit={handleSubmit}>
          <label htmlFor="oldPass">Mật khẩu cũ</label>
          <input
            id="oldPass"
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />

          <label htmlFor="newPass">Mật khẩu mới</label>
          <input
            id="newPass"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <label htmlFor="reNewPass">Nhập lại mật khẩu mới</label>
          <input
            id="reNewPass"
            type="password"
            value={reNewPass}
            onChange={(e) => setReNewPass(e.target.value)}
          />

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
