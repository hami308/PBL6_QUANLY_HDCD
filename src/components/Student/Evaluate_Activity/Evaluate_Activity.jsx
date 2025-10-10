import { useState } from "react";
import "./Evaluate_Activity.css";

function Evaluate_Activity({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [evaluate, setEvaluate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rating:", rating);
    console.log("Đánh giá:", evaluate);
    alert("Cảm ơn bạn đã gửi đánh giá!");
    onClose(); // đóng popup sau khi gửi
  };

  return (
    <div className="review-container">
      <div className="review-card">
        <h2 className="review-title">Đánh giá hoạt động</h2>
        <div className="review-subtitle">
            <span className="material-symbols-outlined">edit_square</span>
            <h3>Viết Đánh Giá</h3>
        </div>
        
        <div className="rating-section">
          <p className="rating-label">⭐ Đánh giá của bạn</p>
          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={index}
                  className={
                    ratingValue <= (hover || rating) ? "star active" : "star"
                  }
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <span class="material-symbols-outlined">star</span>
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

        <div className="review-buttons">
          <button className="cancel-btn" onClick={onClose}>✕ Hủy bỏ</button>
          <button className="submit-btn" onClick={handleSubmit}>
            <span class="material-symbols-outlined">send</span>
             Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}

export default Evaluate_Activity;
