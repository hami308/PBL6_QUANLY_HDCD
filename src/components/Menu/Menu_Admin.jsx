// Menu_Admin.jsx
import React, { useState, useRef, useEffect } from "react";
import "./top_bar.css";
import { useNavigate } from "react-router-dom";

const Menu_Admin = () => {
  const [activeMenu, setActiveMenu] = useState(null); // "xtk" | "qltk" | null
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Mở menu: lưu tên menu và tham chiếu tới nút (DOM element)
  const handleOpenMenu = (menuName, buttonEl) => {
    btnRef.current = buttonEl;
    setActiveMenu(menuName);
  };

  const handleCloseMenu = () => {
    setActiveMenu(null);
  };

  // Cập nhật vị trí dropdown khi activeMenu thay đổi, khi scroll hoặc resize
  useEffect(() => {
    function updatePos() {
      if (btnRef.current && activeMenu) {
        const rect = btnRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8, // cách nút 8px
          left: rect.left + rect.width / 2, // canh giữa nút
        });
      }
    }

    updatePos();
    window.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [activeMenu]);

  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/home-admin">Trang chủ</a>
        <a href="/">Tạo tài khoản</a>
        <a href="/">Xóa tài khoản</a>

        {/* Xem thống kê */}
        <div
          className="profile-dropdown"
          onMouseEnter={(e) =>
            handleOpenMenu("xtk", e.currentTarget.querySelector(".profile-btn"))
          }
          onMouseLeave={handleCloseMenu}
        >
          <button className="profile-btn">Xem thống kê</button>
        </div>

        {/* Quản lý tài khoản */}
        <div
          className="profile-dropdown"
          onMouseEnter={(e) =>
            handleOpenMenu("qltk", e.currentTarget.querySelector(".profile-btn"))
          }
          onMouseLeave={handleCloseMenu}
        >
          <button className="profile-btn">Quản lý tài khoản</button>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Thoát
        </button>
      </nav>

      {/* Dropdown render ở vị trí fixed (viewport) -> không bị cắt bởi overflow của top-bar */}
      {activeMenu === "xtk" && (
        <div
          className="dropdown-menu fixed-dropdown"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          onMouseEnter={() => setActiveMenu("xtk")}
          onMouseLeave={handleCloseMenu}
        >
          <a href="/student-infor">Xem thống kê điểm PVCD</a>
          <a href="/pvcd-record">Xem thống kê các hoạt động</a>
        </div>
      )}

      {activeMenu === "qltk" && (
        <div
          className="dropdown-menu fixed-dropdown"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          onMouseEnter={() => setActiveMenu("qltk")}
          onMouseLeave={handleCloseMenu}
        >
          <a href="/student-infor">Quản lý thông tin tài khoản</a>
          <a href="/pvcd-record">Cấp lại mật khẩu</a>
        </div>
      )}
    </div>
  );
};

export default Menu_Admin;
