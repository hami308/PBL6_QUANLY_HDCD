import { useState } from "react";
import "./Evaluate_Activity.css";
import { create_feedback } from "../../../services/Feedback_Services";

function Evaluate_Activity({ onClose, activityId, title }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [evaluate, setEvaluate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = sessionStorage.getItem("student_id");

    if (!studentId) {
      alert("Không tìm thấy thông tin sinh viên!");
      return;
    }

    if (rating === 0|| evaluate.trim() === "") {
      alert("Vui lòng chọn số sao đánh giá và nhập nội dung đánh giá!");
      return;
    }

    setLoading(true);

    const data = {
      student_id: studentId,
      activity_id: activityId,
      rating: rating,
      commnent: evaluate,
    };

    const res = await create_feedback(data);

    setLoading(false);

    if (res.success) {
      alert("Gửi đánh giá thành công!");
      onClose();
    } else {
      alert("Lỗi: " + res.message);
    }
  };

  return (
    <div className="evaluate-container">
      <div className="evaluate-card">
        <h2 className="evaluate-title">Đánh giá hoạt động</h2>
        <p className="evaluate-activity-title">
          <strong>Hoạt động:</strong> {title}
        </p>
        <div className="rating-section">
          <p className="rating-label">⭐ Đánh giá của bạn</p>
          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={index}
                  className={ratingValue <= (hover || rating) ? "star active" : "star"}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span className="material-symbols-outlined">star</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="comment-section">
          <p className="comment-label">💬 Nội dung đánh giá</p>
          <textarea
            className="comment-input"
            placeholder="Chia sẻ trải nghiệm của bạn về hoạt động này..."
            value={evaluate}
            onChange={(e) => setEvaluate(e.target.value)}
          />
        </div>

        <div className="evaluate-buttons">
          <button className="cancel-evaluate-btn" onClick={onClose} disabled={loading}>
            ✕ Hủy bỏ
          </button>
          <button className="submit-evaluate-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Evaluate_Activity;
