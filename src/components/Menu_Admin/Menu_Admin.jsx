// Menu_Admin.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Menu_Admin.css";
import { useNavigate } from "react-router-dom";

const Menu_Admin = () => {
  const [activeMenu, setActiveMenu] = useState(null); // "xtk" | "qltk" | null
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Mở menu (hover hoặc click)
  const handleOpenMenu = (menuName, buttonEl) => {
    clearTimeout(closeTimeoutRef.current);
    btnRef.current = buttonEl;
    setActiveMenu(menuName);
  };

  const handleCloseMenu = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  // Toggle khi click (chỉ trên mobile)
  const handleToggleMenu = (menuName, e) => {
    e.stopPropagation(); // chặn lan click ra ngoài
    const buttonEl = e.currentTarget;
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      handleOpenMenu(menuName, buttonEl);
    }
  };

  // Tính vị trí dropdown
  useEffect(() => {
    function updatePos() {
      if (btnRef.current && activeMenu) {
        const rect = btnRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 2,
          left: rect.left + rect.width / 2,
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

  // Click ra ngoài sẽ đóng menu (chỉ khi đang mở)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        !document.querySelector(".dropdown-menu")?.contains(e.target)
      ) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/home-admin">Trang chủ</a>
        <a href="/create-account">Tạo tài khoản</a>
        <a href="/delete-account">Xóa tài khoản</a>

        {/* Xem thống kê */}
        <div
          className="profile-dropdown"
          onMouseEnter={(e) => {
            if (!isTouchDevice())
              handleOpenMenu(
                "xtk",
                e.currentTarget.querySelector(".profile-btn")
              );
          }}
          onMouseLeave={() => {
            if (!isTouchDevice()) handleCloseMenu();
          }}
        >
          <button
            className="profile-btn"
            onClick={(e) => {
              if (isTouchDevice()) handleToggleMenu("xtk", e);
            }}
          >
            Xem thống kê
          </button>
        </div>

        {/* Quản lý tài khoản */}
        <div
          className="profile-dropdown"
          onMouseEnter={(e) => {
            if (!isTouchDevice())
              handleOpenMenu(
                "qltk",
                e.currentTarget.querySelector(".profile-btn")
              );
          }}
          onMouseLeave={() => {
            if (!isTouchDevice()) handleCloseMenu();
          }}
        >
          <button
            className="profile-btn"
            onClick={(e) => {
              if (isTouchDevice()) handleToggleMenu("qltk", e);
            }}
          >
            Quản lý tài khoản
          </button>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Thoát
        </button>
      </nav>

      {/* Dropdown render ở vị trí fixed */}
      {activeMenu === "xtk" && (
        <div
          className="dropdown-menu fixed-dropdown"
          style={{
            position: "fixed",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
          onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
          onMouseLeave={() => {
            if (!isTouchDevice()) handleCloseMenu();
          }}
        >
          <a href="/statistic-student">Xem thống kê điểm PVCD</a>
          <a href="/statistic-activity">Xem thống kê các hoạt động</a>
        </div>
      )}

      {activeMenu === "qltk" && (
        <div
          className="dropdown-menu fixed-dropdown"
          style={{
            position: "fixed",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
          onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
          onMouseLeave={() => {
            if (!isTouchDevice()) handleCloseMenu();
          }}
        >
          <a href="/manage-accounts">Quản lý thông tin tài khoản</a>
          <a href="/update-password">Cấp lại mật khẩu</a>
        </div>
      )}
    </div>
  );
};

export default Menu_Admin;
