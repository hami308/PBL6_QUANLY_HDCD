import React, { useState } from "react";
import "./FeedbackPopup.css";

const FeedbackPopup = ({ activity, score, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert("Vui lòng nhập phản hồi!");
      return;
    }
    onSubmit({ activity, score, feedback });
    onClose();
  };

  return (
    <div className="feedback-popup-overlay">
      <div className="feedback-popup-container">
        <p>
          <strong>Hoạt động:</strong> {activity}
        </p>
        <p>
          <strong>Điểm:</strong> {score}
        </p>

        <textarea
          className="feedback-popup-textarea"
          placeholder="Nhập phản hồi của bạn..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <div className="feedback-popup-actions">
          <button className="feedback-popup-cancel" onClick={onClose}>
            Đóng
          </button>
          <button className="feedback-popup-confirm" onClick={handleSubmit}>
            Gửi phản hồi
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
