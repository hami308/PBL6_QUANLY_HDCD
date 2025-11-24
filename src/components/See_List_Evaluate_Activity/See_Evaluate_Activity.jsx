import React, { useState } from "react";
import "./See_Evaluate_Activity.css";
import dayjs from "dayjs";

export default function See_Evaluate_Activity(evaluate_activity_details) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  // Hàm format ngày giờ
  const formatDateTime = (date) => {
    return date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "Không rõ";
  };

  return (
    <div className="see-evaluate-container">
      <div className="see-evaluate-card">
        <div className="see-evaluate-header">
          <div className="see-evaluate-tags">
            <span className="activity-name">
              {evaluate_activity_details.activity_id.title || "Không có tên hoạt động"}
            </span>
            <span className="activity-date">
              {formatDateTime(evaluate_activity_details.activity_id.start_time)} -{" "}
              {formatDateTime(evaluate_activity_details.activity_id.end_time)}
            </span>
          </div>

          <div className="see-evaluate-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < (evaluate_activity_details.rating || 0)
                    ? "star active"
                    : "star inactive"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <h3 className="see-evaluate-name">
          {evaluate_activity_details.student_id?.full_name || "Không rõ sinh viên"}
        </h3>

        <p
          className={`see-evaluate-comment ${expanded ? "expanded" : "collapsed"}`}
        >
          {evaluate_activity_details.comment || "Chưa có nhận xét"}
        </p>

        {evaluate_activity_details.comment?.length > 150 && (
          <span className="toggle-btn" onClick={toggleExpanded}>
            {expanded ? "Thu gọn" : "Xem thêm"}
          </span>
        )}

        <div className="see-evaluate-date">
          Đăng ngày: {formatDateTime(evaluate_activity_details.submitted_at)}
        </div>
      </div>
    </div>
  );
}
