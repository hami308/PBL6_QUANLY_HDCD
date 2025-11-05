import React, { useState, useEffect } from "react";
import "./SubmitEvidence_Page.css";
import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import SubmitEvidence from "../../components/Student/SubmitEvidence/SubmitEvidence";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import { get_evidence_by_idstudent } from "../../services/Evidence_Service";
import { getStudentInfo } from "../../services/Student/StudentInfor_Services.js";

function SubmitEvidence_Page() {
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchEvidences = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user || !user.id) {
          setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        const studentRes = await getStudentInfo(user.id);
        if (!studentRes) {
          setError("Không tìm thấy sinh viên tương ứng với người dùng.");
          setLoading(false);
          return;
        }

        const evidenceRes = await get_evidence_by_idstudent(studentRes._id);
        if (evidenceRes.success && evidenceRes.data?.data) {
          setEvidences(evidenceRes.data.data);
        } else {
          setEvidences([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách minh chứng:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvidences();
  }, [refreshTrigger]);

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
    setRefreshTrigger((prev) => prev + 1);
  };

  // Filter & Sort
  const filteredEvidences = evidences
    .filter((item) => (statusFilter ? item.status === statusFilter : true))
    .sort((a, b) => {
      const dateA = new Date(a.submitted_at);
      const dateB = new Date(b.submitted_at);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="submit-evidence">
      <Header />
      <Menu_student />

      <SubmitEvidence onSubmitSuccess={handleEvidenceSubmitted} />

      <h3 className="cross-bar">Danh sách các minh chứng đã nộp</h3>

      {/* Chỉ hiển thị filter & sort nếu có minh chứng */}
      {filteredEvidences.length > 0 && (
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
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải danh sách minh chứng...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredEvidences.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" , marginBottom:"20px"}}>
          Chưa có minh chứng nào được nộp.
        </p>
      ) : (
        <div className="submit-evidence-customtable">
          <CustomTable
            columns={["Tên hoạt động", "Ngày nộp", "Tình trạng"]}
            data={filteredEvidences.map((item) => ({
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
