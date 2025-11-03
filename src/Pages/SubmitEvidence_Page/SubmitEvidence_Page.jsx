import "./SubmitEvidence_Page.css";
import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import SubmitEvidence from "../../components/Student/SubmitEvidence/SubmitEvidence";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import React, { useState, useEffect } from "react";
import { get_all_evidences } from "../../services/Evidence_Service";

function SubmitEvidence_Page() {
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 🔹 state để trigger reload

  // --- Lấy danh sách minh chứng ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const evidenceRes = await get_all_evidences();
        if (evidenceRes.success && evidenceRes.data?.data) {
          setEvidences(evidenceRes.data.data);
        } else {
          setEvidences([]);
          setError("Không có minh chứng nào được tìm thấy.");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách minh chứng:", err);
        setError("Không thể tải danh sách minh chứng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]); // 🔹 Mỗi khi refreshTrigger thay đổi → reload danh sách

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      default:
        return "Chờ duyệt";
    }
  };

  const handleEvidenceSubmitted = () => {
    // 🔹 Khi con gọi callback, cha sẽ tăng refreshTrigger để reload danh sách
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="submit-evidence">
      <Header />
      <Menu_student />

      {/* Truyền callback xuống component con */}
      <SubmitEvidence onSubmitSuccess={handleEvidenceSubmitted} />

      <h3 className="cross-bar">Danh sách các minh chứng đã nộp</h3>

      <div className="filter-sort-container">
        <select
          name="status"
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">-- Chọn tình trạng --</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
        </select>

        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ marginLeft: 12 }}
        >
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải danh sách minh chứng...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="submit-evidence-customtable">
          <CustomTable
            columns={["Tên hoạt động", "Ngày nộp", "Tình trạng"]}
            data={evidences.map((item) => ({
              tên_hoạt_động: item.title,
              ngày_nộp: new Date(item.submitted_at || "").toLocaleDateString("vi-VN"),
              tình_trạng: getStatusLabel(item.status),
            }))}
            renderActions={(item) => (
              <button className="btn-details">
                <a
                  href={`/evidence-details/${item._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chi tiết
                </a>
              </button>
            )}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default SubmitEvidence_Page;
