import React from "react";
import "./DeleteAccountBox.css";
export function Delete_Account() {
  const handleDelete = (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value.trim();
    if (!username) {
      alert("Vui lòng nhập tên đăng nhập !");
      return;
    }
    //chuyển hướng qua chi tiết tài khoản
  };
  return (
    <div className="delete-account-form">
      <div className="form-title">Xóa 1 tài khoản</div>

      <form onSubmit={handleDelete}>
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            placeholder="Nhập tên đăng nhập..."
          />
        </div>

        <div className="submit-btn">
          <button type="submit">Xóa tài khoản</button>
        </div>
      </form>

      <div className="note">
        <strong>Cảnh báo:</strong> Thao tác này sẽ{" "}
        <span style={{ color: "red", fontWeight: "bold" }}>xóa vĩnh viễn</span>{" "}
        tài khoản của sinh viên. Dữ liệu đã xóa không thể khôi phục.
      </div>
    </div>
  );
}
export default Delete_Account;
