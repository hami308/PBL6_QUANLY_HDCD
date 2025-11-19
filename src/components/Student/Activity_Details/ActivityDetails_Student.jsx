import "../../Activity/Activity_Details.css";
import React from "react";
import dayjs from "dayjs";
import Activity_pic from "../../../assets/images/activity.jpg";
import "./ActivityDetails_Student.css"

function Activity_Details({ activity_details, onCancelRegister }) {

  // ======== Format ngày giờ ========
  const formatDateTime = (date) =>
    date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "Không rõ";

  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "Không rõ";

  const studentStatus = activity_details.student_status;
  const processedTime = activity_details.processed_time;
  const attendanceTime = activity_details.attendance_time;

  // ======== Text trạng thái ========
  const getStatusLabel = () => {
    switch (studentStatus) {
      case "pending":
        return "Đã đăng ký";
      case "approved":
        return "Đã được duyệt";
      case "rejected":
        return "Đã từ chối";
      case "attendanced":
        return "Đã tham gia";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="activity-card-details">

      {/* Tên hoạt động */}
      <div className="activity--details">
        <h1 className="activity-title-details">{activity_details.title}</h1>
      </div>

      {/* Đơn vị tổ chức */}
      <div className="activity-team-details">
        {activity_details.org_unit_id?.name || "Không có đơn vị tổ chức"}
      </div>

      {/* Ảnh */}
      <img
        src={activity_details.image || Activity_pic}
        alt={activity_details.title}
        className="activity-image-details"
      />

      {/* Nội dung */}
      <div className="activity-content-details">

        <div className="field">
          <strong>Mô tả:</strong>
          <p>{activity_details.description}</p>
        </div>

        <div className="field">
          <strong>Thời gian tổ chức:</strong>
          <span>
            {formatDateTime(activity_details.start_time)} –{" "}
            {formatDateTime(activity_details.end_time)}
          </span>
        </div>

        <div className="field">
          <strong>Thời gian đăng ký:</strong>
          <span>
            {formatDate(activity_details.registration_open)} –{" "}
            {formatDate(activity_details.registration_close)}
          </span>
        </div>

        <div className="field">
          <strong>Lĩnh vực:</strong>
          <span>{activity_details.field || "Không rõ"}</span>
        </div>

        <div className="field">
          <strong>Địa điểm:</strong>
          <span>{activity_details.location || "Không rõ"}</span>
        </div>

        {studentStatus && (
          <div className="field">
            <strong>Trạng thái:</strong>
            <span>{getStatusLabel()}</span>
          </div>
        )}

        {(studentStatus === "approved" || studentStatus === "rejected") && (
          <div className="field">
            <strong>Thời gian xử lý:</strong>
            <span>{formatDateTime(processedTime)}</span>
          </div>
        )}

        {studentStatus === "attendanced" && (
          <div className="field">
            <strong>Thời gian điểm danh:</strong>
            <span>{formatDateTime(attendanceTime)}</span>
          </div>
        )}
      </div>

      {/* ======== NÚT HỦY ĐĂNG KÝ ======== */}
      {(studentStatus === "pending" ) && (
        <div className="activity-action">
          <button className="cancel-register-btn" onClick={onCancelRegister}>
            Hủy đăng ký
          </button>
        </div>
      )}
    </div>
  );
}

export default Activity_Details;
