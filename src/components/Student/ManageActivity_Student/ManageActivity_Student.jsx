import "./ManageActivity_Student.css";
import { useState } from "react";
import Evaluate_Activity from "../Evaluate_Activity/Evaluate_Activity";

function ManageActivity_Student({
  id,
  name_activity,
  org,
  start_time,
  end_time,
  location,
  status,
  img
}) {
  const [showEvaluatePopup, setShowEvaluatePopup] = useState(false);
  const date = start_time + " - " + end_time;

  return (
    <>
      <div className="event-card">
        <img src={img} alt="Event" className="event-image" />

        <div className="event-info">
          <div className="event-header">
            <h3 className="event-title">{name_activity}</h3>
          </div>

          <p className="event-club">{org}</p>
          <p className="event-detail">
            <strong>Thời gian:</strong> {date}
          </p>
          <p className="event-detail">
            <strong>Địa điểm:</strong> {location}
          </p>
        </div>

        <div className="event-status-wrapper">
          <span className={`event-status ${status}`}>{status}</span>

          {status === "attendanced" && (
            <p className="event-point">Điểm: 5 điểm</p>
          )}
        </div>

        <div className="event-actions">
          {/* Nút đánh giá chỉ hiển thị khi đã tham gia */}
          {status === "Đã tham gia" && (
            <button
              className="event-link"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEvaluatePopup(true);
              }}
            >
              Đánh giá
            </button>
          )}

          {/* Nút chi tiết luôn hiển thị */}
          <a href={`/activity-details-student/${id}`} className="event-link">
            Chi tiết
          </a>
        </div>
      </div>

      {/* Render popup khi showEvaluatePopup = true */}
      {showEvaluatePopup && (
        <Evaluate_Activity
          onClose={() => setShowEvaluatePopup(false)}
          activityId={id}
          title={name_activity}
        />
      )}
    </>
  );
}

export default ManageActivity_Student;
