import React from "react";
import "./PossitionBox.css";
const PositionBox = ({ username }) => {
  const [name, setName] = React.useState(username || "");
  React.useEffect(() => {
    setName(username || "");
  }, [username]);
  return (
    <div className="position-box">
      <p className="title">Phân quyền cho tài khoản người dùng</p>
      <div className="username">
        <p>Tên đăng nhập:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={!!username}
        />
      </div>
      <div className="position">
        <p>Chức vụ:</p>
        <input type="text" />
      </div>
    </div>
  );
};
export default PositionBox;
