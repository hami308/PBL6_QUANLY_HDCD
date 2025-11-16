import "./Approved_Evidence_Page.css";
import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_org";
import Footer from "../../components/Footer/Footer";
import Filter_Evidence from "../../components/Student/Approved_Evidence/Filter_Evidence.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";

import { useEffect, useState } from "react";
import { get_evidences_by_class } from "../../services/Evidence_Service";
import { getStaffInfo } from "../../services/Staff_Service.js";

function Approved_Evidence_Page() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));

  // ============================
  // HÀM LẤY MINH CHỨNG THEO LỚP
  // ============================
  const fetchEvidencesByClass = async (classId) => {
    try {
      setLoading(true);
      setError("");

      if (!classId) {
        setEvidences([]);
        setTotal(0);
        return;
      }

      const res = await get_evidences_by_class(classId);

      if (res.success) {
        const evidencesData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setEvidences(evidencesData);
        setTotal(evidencesData.length);
      } else {
        setError("Không thể tải minh chứng.");
        setEvidences([]);
        setTotal(0);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi tải dữ liệu.");
      setEvidences([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // LOAD LỚP ĐẦU TIÊN (nếu có)
  // ============================
  useEffect(() => {
    const initLoad = async () => {
      try {
        const staff = await getStaffInfo(user.id);
        const classes = staff?.faculty?.classes || [];

        // Nếu có lớp thì load lớp đầu tiên
        if (classes.length > 0) {
          fetchEvidencesByClass(classes[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu ban đầu.");
      }
    };

    initLoad();
  }, []);

  return (
    <>
      <Header />
      <Menu_org />

      <div className="approved-evidence-background"></div>

      <Filter_Evidence 
        total={total}
        onClassChange={(classId) => fetchEvidencesByClass(classId)}
      />

      <div className="approved-evidence-customtable">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : evidences.length === 0 ? (
          <p>Không có minh chứng nào.</p>
        ) : (
          <CustomTable
            columns={["Tên hoạt động", "Người nộp", "Ngày nộp", "Trạng thái"]}
            data={evidences.map((item) => {
              let statusText =
                item.status === "pending"
                  ? "Chờ duyệt"
                  : item.status === "approved"
                  ? "Đã duyệt"
                  : item.status === "rejected"
                  ? "Từ chối"
                  : "Không xác định";

              return {
                _id: item._id,
                tên_hoạt_động: item.title || "Không có tên",
                người_nộp: item.student_id?.full_name || "Chưa rõ",
                ngày_nộp: item.submitted_at
                  ? new Date(item.submitted_at).toLocaleDateString("vi-VN")
                  : "Không rõ",
                trạng_thái: statusText,
              };
            })}
            renderActions={(item) => (
              <>
                <button className="evidence-details-btn">
                  <a href={`/evidence-details/${item._id}`}>Xem</a>
                </button>
                <button className="approved-evidence-details">
                  <a href={`/evidence-details/${item._id}`}>Duyệt</a>
                </button>
              </>
            )}
          />
        )}
      </div>

      <Footer />
    </>
  );
}

export default Approved_Evidence_Page;
