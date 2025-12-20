import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./FeedbackPopup.css";

const FeedbackPopup = ({ activity, score, data, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState("");
  // Lấy dữ liệu feedback khi popup mở
  useEffect(() => {
    if (data?.feedback) {
      setFeedback(data.feedback);
    } else {
      setFeedback(""); // reset nếu data không có feedback
    }
  }, [data]);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert("Vui lòng nhập phản hồi!");
      return;
    }
    onSubmit({ feedback });
    handleClose(); // gửi xong → đóng popup và reset
  };

  const handleClose = () => {
    setFeedback(""); // reset state feedback
    onClose?.();     // gọi callback từ component cha
  };

  // Chuyển đổi trạng thái từ CSDL sang hiển thị
  const feedbackStatusMap = {
    pending: "Chưa xử lý",
    accepted: "Đã được duyệt",
    rejected: "Đã từ chối",
  };

  const feedbackStatus = data?.feedback_status
    ? feedbackStatusMap[data.feedback_status] || data.feedback_status
    : null;

  const feedbackSubmittedTime = data?.feedback_time;
  const feedbackVerifiedTime = data?.feedback_verified_at;

  return (
    <div className="feedback-popup-overlay">
      <div className="feedback-popup-container">
        
        {/* Thông tin chung */}
        <p><strong>Hoạt động:</strong> {activity}</p>
        <p><strong>Điểm:</strong> {score}</p>

        {/* Nếu có data, hiển thị trạng thái và ngày phản hồi */}
        {data && (
          <>
            {feedbackStatus && (
              <p>
                <strong>Trạng thái phản hồi:</strong>{" "}
                <span
                  style={{
                    color:
                      feedbackStatus === "Đã được duyệt"
                        ? "lightgreen"
                        : feedbackStatus === "Đã từ chối"
                        ? "red"
                        : "orange",
                  }}
                >
                  {feedbackStatus}
                </span>
              </p>
            )}

            {/* Ngày student gửi phản hồi */}
            {feedbackSubmittedTime && (
              <p>
                <strong>Ngày phản hồi:</strong>{" "}
                {dayjs(feedbackSubmittedTime).format("DD/MM/YYYY HH:mm")}
              </p>
            )}

            {/* Ngày xử lý nếu đã duyệt hoặc từ chối */}
            {(feedbackStatus === "Đã được duyệt" || feedbackStatus === "Đã từ chối") && feedbackVerifiedTime && (
              <p>
                <strong>Ngày xử lý:</strong>{" "}
                {dayjs(feedbackVerifiedTime).format("DD/MM/YYYY HH:mm")}
              </p>
            )}
          </>
        )}

        {/* Nội dung phản hồi */}
        <textarea
          className="feedback-popup-textarea"
          placeholder="Nhập phản hồi..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          readOnly={!!data?.feedback} 
        />

        <div className="feedback-popup-actions">
          <button className="feedback-popup-cancel" onClick={handleClose}>
            Đóng
          </button>

          {!data?.feedback && (
            <button className="feedback-popup-confirm" onClick={handleSubmit}>
              Gửi phản hồi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
