import React from "react";
import "./PossitionBox.css";
const PositionBox = () => {
  return (
    <div className="position-box">
      <p className="title">Phân quyền cho tài khoản người dùng</p>
      <div className="username">
        <p>Tên đăng nhập:</p>
        <input type="text" />
      </div>
      <div className="position">
        <p>Chức vụ:</p>
        <input type="text" />
      </div>
    </div>
  );
};
export default PositionBox;
