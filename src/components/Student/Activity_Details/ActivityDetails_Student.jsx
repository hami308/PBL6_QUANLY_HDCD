import "../../Activity/Activity_Details.css";
import React, { useState } from "react";
import dayjs from "dayjs";
import Activity_pic from "../../../assets/images/activity.jpg";
import "./ActivityDetails_Student.css";

import Evaluate_Activity from "../Evaluate_Activity/Evaluate_Activity";

function Activity_Details({ activity_details = {}, onCancelRegister }) {
  const [showEvaluatePopup, setShowEvaluatePopup] = useState(false);

  // Lấy dữ liệu activity và student với giá trị mặc định
  const activity = activity_details.activity || {};
  const student = activity_details.student || {};
  const registration = student.registration || {};
  const attendance = student.attendance || {};
  const orgUnit = activity.org_unit_id || {};
  const field = activity.field_id || {};

  // Format thời gian
  const formatDateTime = (date) =>
    date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "Không rõ";

  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "Không rõ";

  const studentStatus = student.registrationStatus || "unknown";
  const processedTime = registration.approved_at;
  const attendanceTime = attendance.scanned_at;

  // ======== FORMAT TRẠNG THÁI HIỂN THỊ ========
  const renderStatus = () => {
    if (attendanceTime) return "Đã tham gia";

    switch (studentStatus) {
      case "pending":
        return "Đã đăng ký";
      case "approved":
        return "Đã được duyệt";
      case "rejected":
        return "Đã bị từ chối";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="activity-card-details">
      {/* Tên hoạt động */}
      <div className="activity--details">
        <h1 className="activity-title-details">{activity.title || "Không rõ tên"}</h1>
      </div>

      {/* Đơn vị tổ chức */}
      <div className="activity-team-details">
        {orgUnit.name || "Không có đơn vị tổ chức"}
      </div>

      {/* Ảnh */}
      <img
        src={activity.activity_image || Activity_pic}
        alt={activity.title || "Ảnh hoạt động"}
        className="activity-image-details"
      />

      <div className="activity-content-details">
        <div className="field">
          <strong>Mô tả:</strong>
          <p>{activity.description || "Không có mô tả"}</p>
        </div>

        <div className="field">
          <strong>Thời gian tổ chức:</strong>
          <span>
            {formatDateTime(activity.start_time)} – {formatDateTime(activity.end_time)}
          </span>
        </div>

        <div className="field">
          <strong>Lĩnh vực:</strong>
          <span>{field.name || "Không rõ"}</span>
        </div>

        <div className="field">
          <strong>Địa điểm:</strong>
          <span>{activity.location || "Không rõ"}</span>
        </div>

        <div className="field">
          <strong>Trạng thái:</strong>
          <span>{renderStatus()}</span>
        </div>

        <div className="field">
          <strong>Thời gian đăng ký:</strong>
          <span>{formatDate(registration.registered_at)}</span>
        </div>

        {(studentStatus === "approved" || studentStatus === "rejected") && (
          <div className="field">
            <strong>Thời gian xử lý:</strong>
            <span>{formatDateTime(processedTime)}</span>
          </div>
        )}

        {attendanceTime && (
          <div className="field">
            <strong>Thời gian điểm danh:</strong>
            <span>{formatDateTime(attendanceTime)}</span>
          </div>
        )}
      </div>

      {/* Nút hủy đăng ký */}
      {!attendanceTime && studentStatus === "pending" && (
        <div className="activity-action">
          <button className="cancel-register-btn" onClick={onCancelRegister}>
            Hủy đăng ký
          </button>
        </div>
      )}

      {/* Nút đánh giá (khi đã tham gia) */}
      {attendanceTime && (
        <div className="activity-action">
          <button className="evaluate-btn" onClick={() => setShowEvaluatePopup(true)}>
            Đánh giá hoạt động
          </button>
        </div>
      )}

      {/* Popup đánh giá */}
      {showEvaluatePopup && (
        <Evaluate_Activity
          onClose={() => setShowEvaluatePopup(false)}
          activityId={activity._id}
          title={activity.title}
        />
      )}
    </div>
  );
}

export default Activity_Details;
