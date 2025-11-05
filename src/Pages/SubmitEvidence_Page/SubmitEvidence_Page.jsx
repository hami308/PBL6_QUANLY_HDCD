import "./SubmitEvidence_Page.css";
import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import SubmitEvidence from "../../components/Student/SubmitEvidence/SubmitEvidence";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import React, { useState, useEffect } from "react";
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
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user || !user.id) {
          setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        // 🧩 Gọi API lấy thông tin sinh viên
        const studentRes = await getStudentInfo(user.id);
        if (!studentRes) {
          console.error("Không tìm thấy sinh viên tương ứng với user.id");
          setError("Không tìm thấy thông tin sinh viên.");
          return;
        }

        // ⚠️ Một số backend trả về studentId, không phải _id
        const studentId = studentRes.studentId || studentRes._id;

        // 🧩 Gọi API lấy danh sách minh chứng
        const evidenceRes = await get_evidence_by_idstudent(studentId);

        // ✅ Xử lý kết quả theo cấu trúc backend
        const evidenceList =
          evidenceRes?.data?.data ||
          evidenceRes?.data ||
          evidenceRes ||
          [];

        if (evidenceList.length > 0) {
          setEvidences(evidenceList);
        } else {
          setEvidences([]);
          setError("Không có minh chứng nào được tìm thấy.");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách minh chứng:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // 🏷️ Gán nhãn tình trạng
  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      default:
        return "Không xác định";
    }
  };

  // 🧭 Lọc và sắp xếp dữ liệu
  const filteredAndSortedEvidences = evidences
    .filter((item) =>
      statusFilter ? (item.status || "").toLowerCase() === statusFilter : true
    )
    .sort((a, b) => {
      const dateA = new Date(a.submitted_at);
      const dateB = new Date(b.submitted_at);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  // 🔄 Làm mới danh sách khi nộp minh chứng mới
  const handleEvidenceSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="submit-evidence">
      <Header />
      <Menu_student />

      <SubmitEvidence onSubmitSuccess={handleEvidenceSubmitted} />

      <h3 className="cross-bar">Danh sách các minh chứng đã nộp</h3>

      {/* --- Bộ lọc & sắp xếp --- */}
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

      {/* --- Bảng minh chứng --- */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải danh sách minh chứng...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="submit-evidence-customtable">
          <CustomTable
            columns={["Tên hoạt động", "Ngày nộp", "Tình trạng"]}
            data={filteredAndSortedEvidences.map((item) => ({
              _id: item._id,
              tên_hoạt_động: item.title || item.name_activity,
              ngày_nộp: new Date(item.submitted_at || item.date).toLocaleDateString("vi-VN"),
              tình_trạng: getStatusLabel(item.status),
            }))}
            renderActions={(item) => (
              <button className="btn-details">
                <a
                  href={`/evidence-details/${item._id}`}
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
