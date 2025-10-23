import React, { useState, useRef, useEffect } from "react";
import "./Activity_org_component.css";

function Activity_Org_Component({ activity }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Ẩn menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="activity-org-component-card" style={{ zIndex: showMenu ? 1001 : 1 }}>
      <div className="activity-org-component-left">
        <img
          src={activity.image}
          alt={activity.name}
          className="activity-org-component-image"
        />
        <div className="activity-org-component-text-content">
          <h2 className="activity-org-component-title">{activity.name}</h2>
          <span className="activity-org-component-club">{activity.org}</span>
          <p className="activity-org-component-info">Thời gian: {activity.date}</p>
          <p className="activity-org-component-info">Địa điểm: {activity.location}</p>
        </div>
      </div>

      {/* BÊN PHẢI */}
      <div className="activity-org-component-right" ref={menuRef}>
        {/* Trạng thái */}
        <div
          className={`activity-org-component-status ${
            activity.status === "Đã duyệt"
              ? "approved"
              : activity.status === "Chờ duyệt"
              ? "pending"
              : "rejected"
          }`}
        >
          {activity.status}
        </div>

        {/* Icon menu */}
        <span
          className="material-symbols-outlined menu-icon"
          onClick={() => setShowMenu(!showMenu)}
        >
          menu
        </span>

        {showMenu && (
          <ul className="activity-org-component-menu">
            <li onClick={() => alert("Xem chi tiết")}>Xem chi tiết</li>
            <li onClick={() => alert("Chỉnh sửa")}>Chỉnh sửa</li>
            <li onClick={() => alert("Xóa hoạt động")}>Xóa hoạt động</li>
            <li onClick={() => alert("Xóa hoạt động")}>Xóa hoạt động</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Activity_Org_Component;
