import "../../Activity/Activity_Details.css";
import React, { useState } from "react";
import dayjs from "dayjs";
import Activity_pic from "../../../assets/images/activity.jpg";
import "./ActivityDetails_Student.css";

import Evaluate_Activity from "../Evaluate_Activity/Evaluate_Activity";

function Activity_Details({ activity_details, onCancelRegister }) {
  const [showEvaluatePopup, setShowEvaluatePopup] = useState(false);

  // Format thời gian
  const formatDateTime = (date) =>
    date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "Không rõ";

  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "Không rõ";

  // Trạng thái của sinh viên trong hoạt động
  const studentStatus = activity_details.student.registrationStatus;
  const processedTime = activity_details.student.registration.approved_at;
  const attendanceTime = activity_details.student.attendance.scanned_at;

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
        <h1 className="activity-title-details">{activity_details.activity.title}</h1>
      </div>

      {/* Đơn vị tổ chức */}
      <div className="activity-team-details">
        {activity_details.activity.org_unit_id?.name || "Không có đơn vị tổ chức"}
      </div>

      {/* Ảnh */}
      <img
        src={activity_details.activity.activity_image || Activity_pic}
        alt={activity_details.activity.title}
        className="activity-image-details"
      />

      <div className="activity-content-details">

        <div className="field">
          <strong>Mô tả:</strong>
          <p>{activity_details.activity.description}</p>
        </div>

        <div className="field">
          <strong>Thời gian tổ chức:</strong>
          <span>
            {formatDateTime(activity_details.activity.start_time)} –{" "}
            {formatDateTime(activity_details.activity.end_time)}
          </span>
        </div>

        <div className="field">
          <strong>Lĩnh vực:</strong>
          <span>{activity_details.activity.field_id.name || "Không rõ"}</span>
        </div>

        <div className="field">
          <strong>Địa điểm:</strong>
          <span>{activity_details.activity.location || "Không rõ"}</span>
        </div>

        <div className="field">
          <strong>Trạng thái:</strong>
          <span>{renderStatus()}</span>
        </div>

        <div className="field">
          <strong>Thời gian đăng ký:</strong>
          <span>
            {formatDate(activity_details.student.registration.registered_at)}
          </span>
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

      {/* ======== NÚT HỦY ĐĂNG KÝ ======== */}
      {!attendanceTime && studentStatus === "pending" && (
        <div className="activity-action">
          <button className="cancel-register-btn" onClick={onCancelRegister}>
            Hủy đăng ký
          </button>
        </div>
      )}

      {/* ======== NÚT ĐÁNH GIÁ (KHI ĐÃ THAM GIA) ======== */}
      {attendanceTime && (
        <div className="activity-action">
          <button
            className="evaluate-btn"
            onClick={() => setShowEvaluatePopup(true)}
          >
             Đánh giá hoạt động
          </button>
        </div>
      )}

      {/* ======== POPUP ĐÁNH GIÁ ======== */}
      {showEvaluatePopup && (
        <Evaluate_Activity 
          onClose={() => setShowEvaluatePopup(false)}
          activityId={activity_details.activity._id} 
          title={activity_details.activity.title}
        />
      )}


    </div>
  );
}

export default Activity_Details;
