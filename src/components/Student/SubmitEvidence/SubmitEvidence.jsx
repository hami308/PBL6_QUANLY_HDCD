import React, { useState } from "react";
import "./SubmitEvidence.css";
import { submit_evidence } from "../../../services/Evidence_Service";

function SubmitEvidence({ onSubmitSuccess }) {
  const [activityName, setActivityName] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Xử lý khi nộp minh chứng ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset thông báo
    setError("");
    setSuccessMessage("");

    // --- Kiểm tra hợp lệ ---
    if (!activityName.trim() || !evidenceLink.trim() || !score.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (!urlPattern.test(evidenceLink.trim())) {
      setError("Link minh chứng không hợp lệ.");
      return;
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0) {
      setError("Điểm tự đánh giá không được nhỏ hơn 0.");
      return;
    }
    const student_id = sessionStorage.getItem("student_id");
    console.log(student_id);


    setLoading(true);

    const evidenceData = {
      student_id: student_id,
      title: activityName.trim(),
      file_url: evidenceLink.trim(),
      self_point: numericScore,
    };

    try {
      const res = await submit_evidence(evidenceData);

      if (res.success) {
        setSuccessMessage(" Nộp minh chứng thành công");
        setActivityName("");
        setEvidenceLink("");
        setScore("");

        // --- Gọi callback reload danh sách ---
        if (onSubmitSuccess) onSubmitSuccess();

        // --- Tự ẩn thông báo sau 3 giây ---
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(res.message || "Không thể nộp minh chứng, vui lòng thử lại.");
      }
    } catch (err) {
      console.error(" Lỗi khi nộp minh chứng:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => {
                setActivityName(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
            />
          </div>

          <div className="submit-infor">
            <label>Link minh chứng</label>
            <input
              type="text"
              placeholder="Nhập link minh chứng..."
              value={evidenceLink}
              onChange={(e) => {
                setEvidenceLink(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
            />
          </div>

          <div className="submit-infor">
            <label>Điểm tự đánh giá</label>
            <input
              type="number"
              placeholder="0"
              max="100"
              value={score}
              onChange={(e) => {
                setScore(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
            />
          </div>

          {/* Hiển thị thông báo */}
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button
            type="submit"
            className="submit-evidence-button"
            disabled={loading}
          >
            {loading ? "Đang nộp..." : "Nộp minh chứng"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitEvidence;
