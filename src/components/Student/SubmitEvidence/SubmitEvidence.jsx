import React, { useState } from "react";
import "./SubmitEvidence.css";

function SubmitEvidence() {
  const [activityName, setActivityName] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường rỗng
    if (!activityName.trim() || !evidenceLink.trim() || !score.trim()) {
      setError("Vui lòng không để trống các trường.");
      return;
    }

    // Nếu hợp lệ
    setError("");
    alert("✅ Nộp minh chứng thành công!");
    // Ở đây bạn có thể thêm logic gửi dữ liệu lên server (fetch/axios)
  };

  return (
    <div className="submit-evidence-background">
      <div className="submit-evidence-container">
        <h2 className="submit-evidence-title">
          Nộp minh chứng tham gia hoạt động ngoài trường
        </h2>

        <form className="submit-evidence-form" onSubmit={handleSubmit}>
          <div className="submit-infor">
            <label>Tên hoạt động</label>
            <input
              type="text"
              placeholder="Nhập tên hoạt động..."
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
          </div>

          <div className="submit-infor">
            <label>Link minh chứng</label>
            <input
              type="text"
              placeholder="Nhập link minh chứng..."
              value={evidenceLink}
              onChange={(e) => setEvidenceLink(e.target.value)}
            />
          </div>

          <div className="submit-infor">
            <label>Số điểm</label>
            <input
              type="text"
              placeholder="Nhập số điểm tự đánh giá..."
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-evidence-button">
            Nộp minh chứng
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitEvidence;
