import "./Approved_Evidence_Page.css";
import { useEffect, useState } from "react";

import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_org";
import Footer from "../../components/Footer/Footer";
import Filter_Evidence from "../../components/Student/Approved_Evidence/Filter_Evidence.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";

import {
  get_all_evidences,
  get_evidences_by_faculty,
  get_evidences_by_class,
} from "../../services/Evidence_Service";

function Approved_Evidence_Page() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  // ============================
  // LOAD DATA
  // ============================
  const loadEvidences = async ({ facultyId = "all", classId = "all" }) => {
    try {
      setLoading(true);
      setError("");

      let res;

      if (facultyId === "all" && classId === "all") {
        res = await get_all_evidences();
      } else if (facultyId !== "all" && classId === "all") {
        res = await get_evidences_by_faculty(facultyId);
      } else if (classId !== "all") {
        res = await get_evidences_by_class(classId);
      } else {
        setEvidences([]);
        setTotal(0);
        return;
      }

      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      setEvidences(data);
      setTotal(data.length);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu minh chứng.");
      setEvidences([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // INITIAL LOAD: ALL EVIDENCES
  // ============================
  useEffect(() => {
    loadEvidences({ facultyId: "all", classId: "all" });
  }, []);

  // ============================
  // RENDER
  // ============================
  return (
    <div className="approved-evidence-page">
      <Header />
      <Menu_org />

      <div className="approved-evidence-background"></div>

      <Filter_Evidence
        total={total}
        onFilterChange={({ facultyId, classId }) =>
          loadEvidences({ facultyId, classId })
        }
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
              const statusMap = {
                pending: "Chờ duyệt",
                approved: "Đã duyệt",
                rejected: "Từ chối",
              };

              return {
                _id: item._id,
                tên_hoạt_động: item.title || "Không có tên",
                người_nộp: item.student_id?.full_name || "Chưa rõ",
                ngày_nộp: item.submitted_at
                  ? new Date(item.submitted_at).toLocaleDateString("vi-VN")
                  : "Không rõ",
                trạng_thái: statusMap[item.status] || "Không xác định",
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
    </div>
  );
}

export default Approved_Evidence_Page;
