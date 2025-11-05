import "./EvidenceDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_details_evidence_by_id } from "../../../services/Evidence_Service";

function EvidenceDetail() {
  const { id } = useParams();
  const [evidenceInfor, setEvidenceInfor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousPage, setPreviousPage] = useState("");

  const handleBack = () => window.history.back();

  //  Xác định trang trước
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/submit-evidence")) setPreviousPage("submit-evidence");
    else if (referrer.includes("/approved-evidence")) setPreviousPage("approved-evidence");
    else setPreviousPage("");
  }, []);

  //  Lấy chi tiết minh chứng
  useEffect(() => {
    const fetchEvidenceDetail = async () => {
      try {
        const data = await get_details_evidence_by_id(id);
        setEvidenceInfor(data);
      } catch (error) {
        console.error(" Lỗi khi tải chi tiết minh chứng:", error);
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

  const data = evidenceInfor.data;
  const isMonitor = data.student_id.isClassMonitor;
  const isApproved = data.status === "approved";

  //  Quy tắc phân quyền hiển thị
  const canEdit =
    !isMonitor && !isApproved
      ? true
      : isMonitor && previousPage === "submit-evidence"; // lớp trưởng chỉnh sửa khi từ trang submit

  const canApprove = isMonitor && previousPage === "approved-evidence"; // lớp trưởng duyệt khi từ trang duyệt

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
              className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
              value={data.title || ""}
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
            {isMonitor ? (
              <a
                className="evidence-details-link"
                href={data.file_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.file_url}
              </a>
            ) : (
              <input
                className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
                value={data.file_url || ""}
                readOnly={!canEdit}
              />
            )}
          </div>

          {/* Điểm sinh viên */}
          <div className="evidence-details-input-section">
            <p className="evidence-details-label">Điểm sinh viên đánh giá</p>
            <input
              className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
              placeholder="(Chưa có điểm)"
              value={data.self_point || ""}
              readOnly={!canEdit}
            />
          </div>

          {/* Điểm lớp trưởng */}
          {canApprove && (
            <div className="evidence-details-input-section">
              <p className="evidence-details-label">Điểm lớp trưởng đánh giá</p>
              <input
                className={`evidence-details-input ${
                  canEdit || canApprove ? "" : "input-disabled"
                }`}
                placeholder="(Chưa có điểm)"
                value={data.score_moniter || ""}
                readOnly={!canEdit && !canApprove}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="evidence-details-footer">
          {canApprove ? (
            <button className="evidence-details-approve-btn">✓ Duyệt minh chứng</button>
          ) : canEdit ? (
            <button className="evidence-details-update-btn">✓ Cập nhật minh chứng</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EvidenceDetail;
