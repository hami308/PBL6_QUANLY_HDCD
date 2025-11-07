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

  // Loại bỏ khoảng trắng đầu/cuối
  const oldP = oldPass.trim();
  const newP = newPass.trim();
  const reNewP = reNewPass.trim();

  // Kiểm tra nếu người dùng để trống
  if (!oldP || !newP || !reNewP) {
    setMessage("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  // Kiểm tra khoảng trắng ở giữa mật khẩu mới
 if (/^\s|\s$|\s/.test(newPass)) {
  setMessage("Mật khẩu không được chứa khoảng trắng");
  return;
}

  // Kiểm tra độ dài mật khẩu mới
  if (newP.length < 6 || newP.length > 12) {
    setMessage("Mật khẩu mới phải dài từ 6 đến 12 ký tự");
    return;
  }

  // Kiểm tra mật khẩu nhập lại
  if (newP !== reNewP) {
    setMessage("Mật khẩu nhập lại không khớp");
    return;
  }

  try {
    setLoading(true);
    const response = await change_password({
      old_password: oldP,
      new_password: newP,
      confirm_password: reNewP,
    });

    if (!response) {
      setMessage("Không có phản hồi từ server");
      setIsSuccess(false);
      return;
    }

    const resData = response.data ? response.data : response;

    if (!resData.success) {
      console.log("Fail:", resData);
      if( resData.message == "New password must be different from old password"){
        setMessage("Mật khẩu mới phải khác mật khẩu cũ");
        setIsSuccess(false);
      }
      else{
        setMessage(resData.message || "Đổi mật khẩu thất bại");
        setIsSuccess(false);
      }
    } else {
      console.log("Success:", resData);
      setMessage(resData.message || "Đổi mật khẩu thành công");
      setIsSuccess(true);
      setOldPass("");
      setNewPass("");
      setReNewPass("");
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
    "Lưu ý: Không đặt mật khẩu trùng ngày sinh và mật khẩu dài 6 đến 12 ký tự và không chứa khoảng trắng.";

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
            name="oldPassword"
            onChange={(e) => setOldPass(e.target.value)}
          />

          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPass}
            name="newPassword"
            onChange={(e) => setNewPass(e.target.value)}
          />

          <label>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            value={reNewPass}
            name="confirmPassword"
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
