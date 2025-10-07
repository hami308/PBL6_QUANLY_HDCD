import "./top_bar.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Menu_student({ ismoniter_class = true }) {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  //  Tính vị trí dropdown theo nút "Cá nhân"
  const updateDropdownPos = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 2,
        left: rect.left + rect.width / 2,
      });
    }
  };

  //  Khi mở menu thì tính vị trí
  useEffect(() => {
    if (openProfile) updateDropdownPos();
    const handleResizeScroll = () => {
      if (openProfile) updateDropdownPos();
    };
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll);
    return () => {
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [openProfile]);

  //  Tự đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Kiểm tra nếu là mobile -> dùng click thay hover
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
            if (!isTouchDevice()) {
              setOpenProfile(true);
              updateDropdownPos();
            }
          }}
          onMouseLeave={() => {
            if (!isTouchDevice()) setOpenProfile(false);
          }}
        >
          <button
            ref={btnRef}
            className="profile-btn"
            onClick={() => {
              // Nếu là màn hình cảm ứng -> dùng click toggle
              if (isTouchDevice()) {
                setOpenProfile((prev) => !prev);
                updateDropdownPos();
              }
            }}
          >
            Cá nhân
          </button>
        </div>

        <a href="/notifications" className="icon-link">
          <span className="material-symbols-outlined">notifications</span>
        </a>
        <button onClick={handleLogout} className="logout-btn">
          Thoát
        </button>
      </nav>

      {openProfile && (
        <div
          className="dropdown-menu"
          style={{
            position: "fixed",
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <a href="/student-infor">Thông tin cá nhân</a>
          <a href="/pvcd-record">Kết quả phục vụ cộng đồng</a>
          <a href="/submit-evidence">Nộp minh chứng ngoài trường</a>
          <a href="/change-password">Đổi mật khẩu</a>
          {ismoniter_class && <a href="/approved-evidence">Duyệt minh chứng</a>}
        </div>
      )}
    </div>
  );
}

export default Menu_student;
