import "./top_bar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu_student({ ismoniter_class = true }) {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Kiểm tra thiết bị cảm ứng
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/home-student">Trang chủ</a>
        <a href="/attendance">Điểm danh</a>
        <a href="/manage-activities-student">Quản lý hoạt động</a>

        <div
          className="profile-dropdown"
          onMouseEnter={() => {
            if (!isTouchDevice()) setOpenProfile(true);
          }}
          onMouseLeave={() => {
            if (!isTouchDevice()) setOpenProfile(false);
          }}
        >
          <button
            className="profile-btn"
            onClick={() => {
              if (isTouchDevice()) setOpenProfile((prev) => !prev);
            }}
          >
            Cá nhân
          </button>

          {openProfile && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <a href="/student-infor">Thông tin cá nhân</a>
              <a href="/pvcd-record">Kết quả phục vụ cộng đồng</a>
              <a href="/submit-evidence">Nộp minh chứng ngoài trường</a>
              <a href="/change-password">Đổi mật khẩu</a>
              {ismoniter_class && (
                <a href="/approved-evidence">Duyệt minh chứng</a>
              )}
            </div>
          )}
        </div>

        <a href="/notifications" className="icon-link">
          <span className="material-symbols-outlined">notifications</span>
        </a>
        <button onClick={handleLogout} className="logout-btn">
          Thoát
        </button>
      </nav>
    </div>
  );
}

export default Menu_student;
