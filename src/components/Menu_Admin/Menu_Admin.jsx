import React, { useState } from "react";
import "./Menu_Admin.css";
import { Link } from "react-router-dom";

const Menu_Admin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleMouseEnter = (menu1) => setDropdownOpen(menu1);
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
          Xem thống kê
          {dropdownOpen === "thongke" && (
            <ul className="dropdown-menu">
              <li>Xem thống kê điểm PVCD</li>
              <li>Xem thống kê các hoạt động</li>
            </ul>
          )}
        </li>

        <li
          className="menu-item dropdown"
          onMouseEnter={() => handleMouseEnter("quanly")}
          onMouseLeave={handleMouseLeave}
        >
          Quản lý tài khoản
          {dropdownOpen === "quanly" && (
            <ul className="dropdown-menu">
              <li>Quản lý thông tin</li>
              <li>Cấp lại mật khẩu</li>
            </ul>
          )}
        </li>

        <li className="menu-item">Thoát</li>
      </ul>
    </nav>
  );
};

export default Menu_Admin;
