import React, { useState } from "react";
import "./Activity_propose.css";
import { useNavigate } from "react-router-dom";
import Post_Activitty from "../Post_Activity/Post_Activity";

export default function Activity_propose({ activity }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleViewDetails = (id) => {
    navigate(`/activity-details/${id}`);
  };

  const statusClass =
    activity.status === "Đã duyệt" ? "status-approved" : "status-pending";

  return (
    <>
      <div className="activity-propose-card">
        <img
          src={activity.image}
          alt={activity.name}
          className="activity-propose-img"
        />

        <div className="activity-propose-info">
          <div className="activity-propose-header">
            <div>
              <h3 className="activity-propose-title">{activity.name}</h3>
              <span className="activity-propose-club">{activity.org}</span>
            </div>
            <span className={`activity-propose-status ${statusClass}`}>
              {activity.status}
            </span>
          </div>

          <p className="activity-propose-detail">
            <strong>Thời gian:</strong> {activity.time_org_start} -{" "}
            {activity.time_org_end}
          </p>
          <p className="activity-propose-detail">
            <strong>Địa điểm:</strong> {activity.location}
          </p>

          <div className="activity-propose-actions">
            <button
              className="activity-propose-link"
              onClick={() => handleViewDetails(activity.id)}
            >
              Chi tiết
            </button>

            {activity.status === "Đã duyệt" && (
              <button
                className="activity-propose-link post-btn"
                onClick={() => setShowPopup(true)}
              >
                Đăng bài
              </button>
            )}
          </div>
        </div>
      </div>

      {showPopup && <Post_Activitty 
        onClose={() => setShowPopup(false)} 
        activity={activity} 
      />}
    </>
  );
}
