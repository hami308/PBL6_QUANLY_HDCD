import "./EvidenceDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_details_evidence_by_id, update_evidence } from "../../../services/Evidence_Service";

function EvidenceDetail() {
  const { id } = useParams();
  const [evidenceInfor, setEvidenceInfor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousPage, setPreviousPage] = useState("");
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  const handleBack = () => window.history.back();

  // --- Lấy trang trước ---
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/submit-evidence")) setPreviousPage("submit-evidence");
    else if (referrer.includes("/approved-evidence")) setPreviousPage("approved-evidence");
    else setPreviousPage("");
  }, []);

  // --- Lấy chi tiết minh chứng ---
  useEffect(() => {
    const fetchEvidenceDetail = async () => {
      try {
        const data = await get_details_evidence_by_id(id);
        if (data.success) {
          setEvidenceInfor(data);
          setFormData(data.data); // copy sang form để chỉnh sửa
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết minh chứng:", error);
        alert("Không thể tải chi tiết minh chứng!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvidenceDetail();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>;
  if (!evidenceInfor)
    return <p style={{ textAlign: "center", color: "red" }}>Không tìm thấy minh chứng.</p>;

  const data = formData;
  const isMonitor = data.student_id.isClassMonitor;
  const isApproved = data.status === "approved";

  // --- Phân quyền ---
  const canEdit =
    !isMonitor && !isApproved
      ? true
      : isMonitor && previousPage === "submit-evidence";
  const canApprove = isMonitor && previousPage === "approved-evidence";

  // --- Xử lý thay đổi input ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Cập nhật minh chứng ---
  const handleUpdate = async () => {
    if (!window.confirm("Bạn có chắc muốn cập nhật minh chứng này?")) return;
    setUpdating(true);
    const result = await update_evidence(id, formData);
    setUpdating(false);
    if (result.success) {
      alert(" Cập nhật minh chứng thành công!");
    } else {
      alert(result.message);
    }
  };

  // --- Duyệt minh chứng ---
  const handleApprove = async () => {
    if (!window.confirm("Bạn có chắc muốn duyệt minh chứng này?")) return;
    setUpdating(true);
    // const result = await approve_evidence(id, {
    //   score_moniter: formData.score_moniter || 0,
    //   status: "approved",
    // });
    // setUpdating(false);
    // if (result.success) {
    //   alert(" Minh chứng đã được duyệt!");
    //   handleBack();
    // } else {
    //   alert(result.message);
    // }
  };

  return (
    <div className="evidence-details-background">
      <div className="evidence-details-container">
        {/* --- Nút trở về --- */}
        <div className="evidence-details-back">
          <button onClick={handleBack} className="evidence-back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>

        <div className="evidence-details-title">
          <h3>Chi tiết minh chứng</h3>
        </div>
        <hr />

        <div className="evidence-details-content">
          {/* Tên hoạt động */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Tên hoạt động:</p>
            <input
              name="title"
              className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
              value={data.title || ""}
              onChange={handleChange}
              readOnly={!canEdit}
            />
          </div>

          {/* Người nộp */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Người nộp:</p>
            <input className="evidence-details-input" value={data.student_id.full_name || ""} readOnly />
          </div>

          {/* Ngày nộp */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Ngày nộp:</p>
            <input
              className="evidence-details-input"
              value={
                data.submitted_at
                  ? new Date(data.submitted_at).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              readOnly
            />
          </div>

          {/* Trạng thái */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Trạng thái:</p>
            <input
              className={`evidence-details-input ${isApproved ? "approved" : "waiting"}`}
              value={isApproved ? "Đã duyệt" : "Chờ duyệt"}
              readOnly
            />
          </div>

          {/* Link minh chứng */}
          <div className="evidence-details-input-section">
            <p className="evidence-details-label">Minh chứng</p>
            <input
              name="file_url"
              className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
              value={data.file_url || ""}
              onChange={handleChange}
              readOnly={!canEdit}
            />
          </div>

          {/* Điểm sinh viên */}
          <div className="evidence-details-input-section">
            <p className="evidence-details-label">Điểm sinh viên đánh giá</p>
            <input
              name="self_point"
              type="number"
              className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
              placeholder="(Chưa có điểm)"
              value={data.self_point || ""}
              onChange={handleChange}
              readOnly={!canEdit}
            />
          </div>

          {/* Điểm lớp trưởng */}
          {canApprove && (
            <div className="evidence-details-input-section">
              <p className="evidence-details-label">Điểm lớp trưởng đánh giá</p>
              <input
                name="score_moniter"
                type="number"
                className={`evidence-details-input ${canApprove ? "" : "input-disabled"}`}
                placeholder="(Chưa có điểm)"
                value={data.score_moniter || ""}
                onChange={handleChange}
                readOnly={!canApprove}
              />
            </div>
          )}
        </div>

        {/* --- Footer --- */}
        <div className="evidence-details-footer">
          {canApprove ? (
            <button
              className="evidence-details-approve-btn"
              onClick={handleApprove}
              disabled={updating}
            >
              {updating ? "Đang duyệt..." : "✓ Duyệt minh chứng"}
            </button>
          ) : canEdit ? (
            <button
              className="evidence-details-update-btn"
              onClick={handleUpdate}
              disabled={updating}
            >
              {updating ? "Đang cập nhật..." : "✓ Cập nhật minh chứng"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EvidenceDetail;
