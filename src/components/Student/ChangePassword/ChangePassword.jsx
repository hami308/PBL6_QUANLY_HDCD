import React, { useState } from "react";
import "./ChangePassword.css";
import { change_password } from "../../../services/Password_service";

function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    //  Validate cơ bản trước khi gọi API
    if (!oldPass || !newPass || !reNewPass) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPass.length < 6 || newPass.length > 12) {
      setMessage("Mật khẩu mới phải dài từ 6 đến 12 ký tự");
      return;
    }

    if (newPass !== reNewPass) {
      setMessage("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setLoading(true);
      const response = await change_password({
        old_password: oldPass,
        new_password: newPass,
        confirm_password: reNewPass,
      });

      if (response.data.success) {
        setMessage(response.data.message || "Đổi mật khẩu thành công!");
        setIsSuccess(true);
        setOldPass("");
        setNewPass("");
        setReNewPass("");
      } else {
        setMessage(response.message || "Đổi mật khẩu thất bại");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error("Change password error:", err);
      setMessage("Lỗi kết nối đến server, vui lòng thử lại sau.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const note_mes =
    "Lưu ý: Không đặt mật khẩu trùng ngày sinh và mật khẩu dài 6 đến 12 ký tự.";

  return (
    <div className="change-password-background">
      <div className="change-password-container">
        <h2 className="change-password-title">Đổi mật khẩu</h2>
        <p className="change-password-note">{note_mes}</p>

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

          {message && (
            <div
              className={`bottom-message ${isSuccess ? "success" : "error"}`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="change-password-button"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Lưu mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
