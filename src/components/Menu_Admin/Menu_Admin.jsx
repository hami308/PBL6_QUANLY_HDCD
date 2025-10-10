import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu_Admin.css";

const Menu_Admin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleMouseEnter = (menu) => setDropdownOpen(menu);
  const handleMouseLeave = () => setDropdownOpen(null);

  return (
    <nav className="menu-container">
      <ul className="menu">
        <li className="menu-item">
          <Link to="/home-admin" className="menu-link">
            Trang chủ
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/create-account" className="menu-link">
            Tạo tài khoản
          </Link>
        </li>

        <li className="menu-item">
          <Link to="/delete-account" className="menu-link">
            Xóa tài khoản
          </Link>
        </li>

        <li
          className="menu-item dropdown"
          onMouseEnter={() => handleMouseEnter("thongke")}
          onMouseLeave={handleMouseLeave}
        >
          <span className="menu-link">Xem thống kê</span>
          {dropdownOpen === "thongke" && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/statistical/Score" className="dropdown-link">
                  Xem thống kê điểm PVCD
                </Link>
              </li>
              <li>
                <Link to="/statistical/Activity" className="dropdown-link">
                  Xem thống kê các hoạt động
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li
          className="menu-item dropdown"
          onMouseEnter={() => handleMouseEnter("quanly")}
          onMouseLeave={handleMouseLeave}
        >
          <span className="menu-link">Quản lý tài khoản</span>
          {dropdownOpen === "quanly" && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/useraccount-management" className="dropdown-link">
                  Quản lý thông tin
                </Link>
              </li>
              <li>
                <Link to="/update-password" className="dropdown-link">
                  Cấp lại mật khẩu
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="menu-item menu-exit">
          <span className="menu-link">Thoát</span>
        </li>
      </ul>
    </nav>
  );
};

export default Menu_Admin;
