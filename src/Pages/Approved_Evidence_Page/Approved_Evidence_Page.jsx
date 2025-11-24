import "./Approved_Evidence_Page.css";
import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_org";
import Footer from "../../components/Footer/Footer";
import Filter_Evidence from "../../components/Student/Approved_Evidence/Filter_Evidence.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";

import { useEffect, useState } from "react";
import {
  get_evidences_by_class,
  get_evidences_by_faculty,
  get_all_evidences,
} from "../../services/Evidence_Service";
import { getStaffInfo } from "../../services/Staff_Service.js";

function Approved_Evidence_Page() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));

  // ============================
  // TẢI DỮ LIỆU TỪ API
  // ============================
  const loadEvidences = async ({ facultyId, classId }) => {
    try {
      setLoading(true);
      setError("");

      let res;

      // ==== TRƯỜNG HỢP 1: tất cả khoa + tất cả lớp ====
      if (facultyId === "all" && classId === "all") {
        res = await get_all_evidences();
      }
      // ==== TRƯỜNG HỢP 2: chỉ chọn khoa ====
      else if (facultyId && (classId === "all" || !classId)) {
        res = await get_evidences_by_faculty(facultyId);
      }
      // ==== TRƯỜNG HỢP 3: chọn lớp cụ thể ====
      else if (classId && classId !== "all") {
        res = await get_evidences_by_class(classId);
      } else {
        setEvidences([]);
        setTotal(0);
        return;
      }

      const evidencesData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setEvidences(evidencesData);
      setTotal(evidencesData.length);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu.");
      setEvidences([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // TẢI DỮ LIỆU BAN ĐẦU
  // ============================
  useEffect(() => {
    const initLoad = async () => {
      try {
        const staff = await getStaffInfo(user.id);

        const facultyId = staff?.faculty?._id || "all";
        const classes = staff?.faculty?.classes || [];

        if (classes.length > 0) {
          loadEvidences({ facultyId, classId: classes[0]._id });
        } else {
          loadEvidences({ facultyId, classId: "all" });
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
        onFilterChange={({ facultyId, classId }) => {
          loadEvidences({ facultyId, classId });
        }}
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
              const statusText =
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
