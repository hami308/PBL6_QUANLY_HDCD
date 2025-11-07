import "./Approved_Evidence_Page.css";
import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student";
import Footer from "../../components/Footer/Footer";
import Filter_Evidence from "../../components/Student/Approved_Evidence/Filter_Evidence.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import { useEffect, useState } from "react";
import { get_evidences_by_class } from "../../services/Evidence_Service";
import { getStudentInfo } from "../../services/Student/StudentInfor_Services";

function Approved_Evidence_Page() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchEvidences() {
      try {
        setLoading(true);
        setError("");

        //  1. Lấy user từ session
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!user) {
          setError("Không tìm thấy thông tin sinh viên trong phiên làm việc.");
          setLoading(false);
          return;
        }

        //  2. Gọi API lấy thông tin sinh viên để biết lớp
        const studentRes = await getStudentInfo(user.id);
        if (!studentRes) {
          setError("Không thể lấy thông tin sinh viên.");
          setLoading(false);
          return;
        }

        const classId = studentRes.class_id._id;
        if (!classId) {
          setError("Không xác định được lớp của sinh viên.");
          setLoading(false);
          return;
        }

        //  3. Gọi API lấy danh sách minh chứng theo lớp
        const res = await get_evidences_by_class(classId);
        if (res.success) {
           let evidencesData = Array.isArray(res.data)? res.data: Array.isArray(res.data?.data)? res.data.data: [];
           setEvidences(evidencesData);
            setTotal(evidencesData.length);
        } else {
          setError(res.message);
        }
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi trong quá trình tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvidences();
  }, []);

  return (
    <>
      <Header />
      <Menu_student />
      <div className="approved-evidence-background"></div>
      <Filter_Evidence  total={total}/>

      <div className="approved-evidence-customtable">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : evidences.length === 0 ? (
          <p>Không có minh chứng nào trong lớp.</p>
        ) : (
          <CustomTable
  columns={["Tên hoạt động", "Người nộp", "Ngày nộp", "Trạng thái"]}
  data={evidences.map((item) => {
    // ánh xạ trạng thái tiếng Anh sang tiếng Việt
    let trangThai = "Không xác định";
    switch (item.status) {
      case "pending":
        trangThai = "Chờ duyệt";
        break;
      case "approved":
        trangThai = "Đã duyệt";
        break;
      case "rejected":
        trangThai = "Từ chối";
        break;
      default:
        trangThai = item.status || "Chưa rõ";
    }

    return {
      _id: item._id,
      tên_hoạt_động: item.title || "Không có tên",
      người_nộp: item.student_id?.full_name || "Chưa rõ",
      ngày_nộp: item.submitted_at
        ? new Date(item.submitted_at).toLocaleDateString("vi-VN")
        : "Không rõ",
      trạng_thái: trangThai,
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
