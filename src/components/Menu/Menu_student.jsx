import "./top_bar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu_student() {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/home_student">Trang chủ</a>
        <a href="/attendance">Điểm danh</a>
        <a href="/activities">Quản lý hoạt động</a>

        <div 
          className="profile-dropdown" 
          onMouseEnter={() => setOpenProfile(true)}
          onMouseLeave={() => setOpenProfile(false)}
        >
          <button className="profile-btn">Cá nhân</button>
          {openProfile && (
            <div className="dropdown-menu">
              <a href="/profile">Thông tin cá nhân</a>
              <a href="/community-results">Kết quả phục vụ cộng đồng</a>
              <a href="/submit-evidence">Nộp minh chứng ngoài trường</a>
              <a href="/change-password">Đổi mật khẩu</a>
            </div>
          )}
        </div>

        <a href="/notifications" className="icon-link"><span className="material-symbols-outlined">
          notifications
        </span></a>
        <button onClick={handleLogout} className="logout-btn">Thoát</button>
      </nav>
    </div>
  );
}

export default Menu_student;
