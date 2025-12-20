import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Activity_org_component.css";
import Post_Activity from "../Post_Activity/Post_Activity";
import { cancel_activity } from "../../../services/Activity_Services";
import CancelActivityPopup from "../../Popup/CancelActivityPopup";
import Activity_pic from "../../../assets/images/activity.jpg";


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
  const handleCancelActivity = async (reason) => {
    try {
      const res = await cancel_activity(activity._id, { reason });

      if (res.success) {
        alert("Hủy hoạt động thành công!");
        window.location.reload();
      } else {
        alert("Hủy thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi hủy hoạt động!");
    }
  };
  const imageSrc = activity.activity_image || Activity_pic;
  return (
    <>
      <div
        className="activity-org-component-card"
        style={{ zIndex: showMenu ? 999 : 1 }}
      >
        <div className="activity-org-component-left">
          <img
            src={imageSrc}
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
      {showPostPopup && (
        <Post_Activity
          onClose={() => setShowPostPopup(false)}
          activity={activity}
        />
      )}

      {showCancelPopup && (
        <CancelActivityPopup
          onClose={() => setShowCancelPopup(false)}
          onConfirm={handleCancelActivity}
        />
      )}
    </>
  );
}

export default Activity_Org_Component;
