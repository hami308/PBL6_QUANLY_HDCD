import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Activity_org_component.css";
import Post_Activity from "../Post_Activity/Post_Activity";

function Activity_Org_Component({ activity }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

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
    <>
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

              {/* Đăng bài */}
              <li onClick={() => setShowPostPopup(true)}>
                Đăng bài hoạt động
              </li>

              {/* Hủy hoạt động */}
              {activity.status !== "hủy hoạt động" && (
                <li onClick={() => setShowCancelPopup(true)}>
                  Hủy hoạt động
                </li>
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

      {/* Popup đăng bài */}
      {showPostPopup && (
        <Post_Activity
          onClose={() => setShowPostPopup(false)}
          activity={activity}
        />
      )}

      {/* Popup hủy */}
      {showCancelPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Bạn có chắc muốn hủy hoạt động?</h3>

            <button className="confirm-btn">
              Xác nhận hủy
            </button>

            <button className="cancel-btn" onClick={() => setShowCancelPopup(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Activity_Org_Component;
