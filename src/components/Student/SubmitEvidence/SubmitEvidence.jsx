import React, { useState, useEffect } from "react";
import "./SubmitEvidence.css";
import { submit_evidence } from "../../../services/Evidence_Service";
import { getStudentInfo } from "../../../services/Student/StudentInfor_Services";

function SubmitEvidence() {
  const [activityName, setActivityName] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);

  // --- Gọi API lấy thông tin sinh viên ---
  useEffect(() => {
    const fetchStudent = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !(user.id || user._id)) {
        setError("Không tìm thấy ID người dùng trong sessionStorage.");
        return;
      }

      try {
        const studentRes = await getStudentInfo(user.id || user._id);

        if (studentRes && (studentRes.success || studentRes._id)) {
          setStudent(studentRes.data || studentRes);
        } else {
          console.error("Không tìm thấy sinh viên tương ứng với user.id");
          setError("Không thể tải thông tin sinh viên.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin sinh viên:", err);
        setError("Không thể tải thông tin sinh viên.");
      }
    };

    fetchStudent();
  }, []);

  // --- Submit minh chứng ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activityName.trim() || !evidenceLink.trim() || !score.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!student?._id) {
      setError("Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.");
      return;
    }

    setError("");
    setLoading(true);

    // Dữ liệu gửi lên API 
    const evidenceData = {
      student_id: student._id,
      title: activityName,
      file_url: evidenceLink,
      self_point: Number(score),
    };

    try {
      const res = await submit_evidence(evidenceData);
      if (res.success) {
        alert("Nộp minh chứng thành công!");
        setActivityName("");
        setEvidenceLink("");
        setScore("");
      } else {
        setError(res.message || "Không thể nộp minh chứng, vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi nộp minh chứng:", err);
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
            <label>Điểm tự đánh giá</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-evidence-button" disabled={loading}>
            {loading ? "Đang nộp..." : "Nộp minh chứng"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitEvidence;
