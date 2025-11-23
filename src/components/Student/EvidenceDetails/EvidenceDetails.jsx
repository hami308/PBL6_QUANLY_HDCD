import "./EvidenceDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  get_details_evidence_by_id,
  update_evidence,
  approve_evidence,
} from "../../../services/Evidence_Service";

function EvidenceDetail() {
  const { id } = useParams();
  const [evidenceInfo, setEvidenceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const user=JSON.parse(sessionStorage.getItem("user"));
  const role = user?.roles?.[0]?.role;

  const handleBack = () => window.history.back();

  //  Lấy chi tiết minh chứng
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await get_details_evidence_by_id(id);
        console.log("res detail evidence", res);
        if (res.success) {
          setEvidenceInfo(res.data);
          setFormData(res.data);
        } else {
          alert(res.message);
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết minh chứng:", error);
        alert("Không thể tải dữ liệu minh chứng.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>;
  if (!evidenceInfo)
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Không tìm thấy minh chứng.
      </p>
    );

  const data = formData;
  const isApproved = data.status === "approved";

  //  Quyền chỉnh sửa
  const canEdit = role === "student" && !isApproved;
  const canApprove = role === "staff";

  //  Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Cập nhật minh chứng (student)
  const handleUpdate = async () => {
    if (!window.confirm("Bạn có chắc muốn cập nhật minh chứng?")) return;

    setUpdating(true);
    const res = await update_evidence(id, formData);
    setUpdating(false);

    if (res.success) {
      alert("Cập nhật thành công!");
      handleBack();
    } else {
      alert(res.message);
    }
  };

  //  Staff duyệt minh chứng
  const handleApproveEvidence = async () => {
    if (!window.confirm("Xác nhận duyệt minh chứng?")) return;

    setUpdating(true);
    console.log("form data", formData.faculty_point);
    const res = await approve_evidence(id, {  
      faculty_point: formData.faculty_point || 0,
      status: "approved",
    });
    setUpdating(false);

    if (res.success) {
      alert("Duyệt minh chứng thành công!");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="evidence-details-background">
      <div className="evidence-details-container">
        {/* 🔙 Nút trở về */}
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
          {/*  Tên hoạt động */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Tên hoạt động:</p>
            <input
              name="title"
              className={`evidence-details-input ${
                canEdit ? "" : "input-disabled"
              }`}
              value={data.title || ""}
              onChange={handleChange}
              readOnly={!canEdit}
            />
          </div>

          {/*  Người nộp */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Người nộp:</p>
            <input
              className="evidence-details-input"
              value={data.student_id.full_name || ""}
              readOnly
            />
          </div>

          {/*  Ngày nộp */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Ngày nộp:</p>
            <input
              className="evidence-details-input"
              value={
                data.submitted_at
                  ? new Date(data.submitted_at).toLocaleString("vi-VN")
                  : ""
              }
              readOnly
            />
          </div>

          {/*  Trạng thái */}
          <div className="evidence-details-info-row">
            <p className="evidence-details-label">Trạng thái:</p>
            <input
              className={`evidence-details-input ${
                isApproved ? "approved" : "waiting"
              }`}
              value={isApproved ? "Đã duyệt" : "Chờ duyệt"}
              readOnly
            />
          </div>

        <div className="evidence-details-input-section">
          <p className="evidence-details-label">Minh chứng</p>

          {canApprove ? (
            // STAFF: input đọc được nhưng click mở link
            <input
              name="file_url"
              className="evidence-details-input"
              value={data.file_url || ""}
              readOnly
              onClick={() => {
                if (data.file_url) window.open(data.file_url, "_blank", "noopener,noreferrer");
              }}
              style={{ cursor: data.file_url ? "pointer" : "not-allowed" }}
            />
          ) : (
            // STUDENT: có thể chỉnh sửa nếu chưa duyệt
            <input
              name="file_url"
              className={`evidence-details-input ${canEdit ? "" : "input-disabled"}`}
              value={data.file_url || ""}
              onChange={handleChange}
              readOnly={!canEdit}
            />
          )}
        </div>


          {/*  Điểm sinh viên */}
          <div className="evidence-details-input-section">
            <p className="evidence-details-label">
              Điểm sinh viên đánh giá
            </p>
            <input
              name="self_point"
              type="number"
              className={`evidence-details-input ${
                canEdit ? "" : "input-disabled"
              }`}
              value={data.self_point || ""}
              onChange={handleChange}
              readOnly={!canEdit}
            />
          </div>

          {/*  Điểm khoa (staff) */}
          {role === "staff" && (
            <div className="evidence-details-input-section">
              <p className="evidence-details-label">
                Điểm đánh giá của khoa
              </p>
              <input
                name="faculty_point"
                type="number"
                className="evidence-details-input"
                value={data.faculty_point || ""}
                onChange={handleChange}
                min={0}
                placeholder="0"
              />
            </div>
          )}
        </div>

        {/*  Footer action */}
        <div className="evidence-details-footer">
          {canApprove ? (
            <button
              className="evidence-details-approve-btn"
              onClick={handleApproveEvidence}
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
