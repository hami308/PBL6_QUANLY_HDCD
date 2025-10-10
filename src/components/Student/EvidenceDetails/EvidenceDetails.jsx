import "./EvidenceDetails.css";

function EvidenceDetail({is_moniter_class=true}) {
    const evidenceInfor = {
        id: 1,
        name: "Tham gia hội thảo khoa học quốc gia",
        name_student: "Nguyễn Thị B",
        link: "https://example.com/minhchung1",
        score: "5",
        date: "01/10/2025",
        status: "Đã duyệt",
        };
  return (
    <>
      <div className="evidence-details-background">
        <div className="evidence-details-container">
          <div className="evidence-details-tiltle">
            <h3>Chi tiết minh chứng</h3>
          </div>
          <hr />

          <div className="evidence-details-content">
            <div className="evidence-details-info-row">
              <p className="evidence-details-label">Tên hoạt động:</p>
              <input
                className="evidence-details-input"
                value={evidenceInfor.name}
                readOnly
              />
            </div>

            <div className="evidence-details-info-row">
              <p className="evidence-details-label">Người nộp:</p>
              <input
                className="evidence-details-input"
                value={evidenceInfor.name_student}
                readOnly
              />
            </div>

            <div className="evidence-details-info-row">
              <p className="evidence-details-label">Ngày nộp:</p>
              <input
                className="evidence-details-input"
                value={evidenceInfor.date}
                readOnly
              />
            </div>

            <div className="evidence-details-info-row">
              <p className="evidence-details-label">Trạng thái:</p>
              <input
                className="evidence-details-input waiting"
                value={evidenceInfor.status}
                readOnly
              />
            </div>
            {is_moniter_class && (
               <div className="evidence-details-input-section">
                <p className="evidence-details-label">Minh chứng</p>
                <a
                  className="evidence-details-link"
                  href={evidenceInfor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {evidenceInfor.link}
                </a>
              </div> 
            )}
            {!is_moniter_class && (
              <div className="evidence-details-input-section">
                <p className="evidence-details-label">Minh chứng</p>
                <input
                  className="evidence-details-input-disabled"
                  value={evidenceInfor.link}
                />
              </div>
            )}

            <div className="evidence-details-input-section">
              <p className="evidence-details-label">Điểm sinh viên đánh giá</p>
              <input
                className="evidence-details-input-disabled"
                placeholder="(Chưa có điểm)"
                value={evidenceInfor.score}
                readOnly={is_moniter_class}
              />
            </div>
            {is_moniter_class && (
              <div className="evidence-details-input-section">
                <p className="evidence-details-label">Điểm lớp trưởng đánh giá</p>
                <input
                  className="evidence-details-input-disabled"
                  placeholder="(Chưa có điểm)"
                />
              </div>
            )}         
          </div>

            {is_moniter_class && (
              <div className="evidence-details-footer">
                <button className="evidence-details-approve-btn">
                  ✓ Duyệt minh chứng
                </button>
              </div>
            )}

            {!is_moniter_class && (
               <div className="evidence-details-footer">
                <button className="evidence-details-update-btn">
                  ✓ Cập nhật minh chứng
                </button>
              </div>
            )}         
        </div>
      </div>
    </>
  );
}

export default EvidenceDetail;
 