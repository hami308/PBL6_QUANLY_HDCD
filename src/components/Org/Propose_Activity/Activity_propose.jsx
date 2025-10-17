import React from "react";
import "./Activity_propose.css";
import { useNavigate } from "react-router-dom";

export default function Activity_propose({activity}) {
  const navigate = useNavigate();
   const handleViewDetails = (id="1") => {
    navigate(`/activity-details/${id}`);
  };
  const statusClass =
    activity.status === "Đã duyệt"
      ? "status-approved"
      : "status-pending";

  return (
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
          <span className={`activity-propose-status ${statusClass}`}>{activity.status}</span>
        </div>

        <p className="activity-propose-detail">
          <strong>Thời gian:</strong> {activity.time_org_start} - {activity.time_org_end}
        </p>
        <p className="activity-propose-detail">
          <strong>Địa điểm:</strong> {activity.location}
        </p>

        <div className="activity-propose-actions">
          <button className="activity-propose-link" onClick={() => handleViewDetails(1)}>Chi tiết</button>
          {activity.status==="Đã được duyệt" ?  <button className="activity-propose-link">Đăng bài</button> : <></> }
         
        </div>
      </div>
    </div>
  );
}
