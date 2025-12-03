import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Activity_org_component.css";

function Activity_Org_Component({ activity }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateTime = (isoString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(isoString).toLocaleString("vi-VN", options);
  };

  const date = `${formatDateTime(activity.start_time)} - ${formatDateTime(activity.end_time)}`;

  return (
    <div
      className="activity-org-component-card"
      style={{ zIndex: showMenu ? 1001 : 1 }}
    >
      <div className="activity-org-component-left">
        <img
          src={activity.activity_image}
          alt={activity.name}
          className="activity-org-component-image"
        />
        <div className="activity-org-component-text-content">
          <h2 className="activity-org-component-title">{activity.title}</h2>
          <span className="activity-org-component-club">
            {activity.org_unit_id.name}
          </span>
          <p className="activity-org-component-info">Thời gian: {date}</p>
          <p className="activity-org-component-info">
            Địa điểm: {activity.location}
          </p>
        </div>
      </div>

      <div className="activity-org-component-right" ref={menuRef}>
        <div className="activity-org-component-status">{activity.status}</div>

        <span
          className="material-symbols-outlined menu-icon"
          onClick={() => setShowMenu(!showMenu)}
        >
          menu
        </span>

        {showMenu && (
          <ul className="activity-org-component-menu">
            <li onClick={() => navigate(`/activity-details/${activity._id}?from=manage-activity-org`)}>
              Xem chi tiết
            </li>

            {activity.status !== "hủy hoạt động" && (
              <li onClick={() => alert("Chức năng hủy hoạt động")}>Hủy hoạt động</li>
            )}

            <li onClick={() => navigate(`/list-student-registered/${activity._id}`)}>
              Xem danh sách sinh viên
            </li>

            <li onClick={() => navigate(`/list-student-attendance/${activity._id}`)}>
              Xác nhận điểm
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Activity_Org_Component;
