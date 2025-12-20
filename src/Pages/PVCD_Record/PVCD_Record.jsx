import { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Total_Record from "../../components/PVCD_Record/Total_Record.jsx";
import List_Year_Record from "../../components/PVCD_Record/List_Year_Record.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import FeedbackPopup from "../../components/Popup/FeedbackPopup.jsx";
import dut_pic from "../../assets/images/anhnen.jpg";

import {
  get_attendance_by_idstudent,
  get_attendance_detail,
  submit_feedback,
} from "../../services/Attendance_Services.js";
import { get_my_approved_evidences } from "../../services/Evidence_Service.js";
import { get_pvcd_by_idstudent } from "../../services/PVCD_Service.js";

import "./PVCD_Record.css";

function PVCD_Record() {
  const studentId = sessionStorage.getItem("student_id");
  const GOAL_RECORD = 15;

  const [activities, setActivities] = useState([]);
  const [yearRecords, setYearRecords] = useState([]);
  const [summary, setSummary] = useState({ totalScore: 0, totalActivity: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "");

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [attendanceRes, evidenceRes, yearRes] = await Promise.all([
          get_attendance_by_idstudent(studentId),
          get_my_approved_evidences(studentId),
          get_pvcd_by_idstudent(studentId),
        ]);

        // --- Map evidence theo attendance_id ---
        const rawEvidences = evidenceRes?.data?.data?.evidences || [];
        const approvedEvidences = rawEvidences.filter((ev) => ev.status === "approved");
        const evidenceMap = approvedEvidences.reduce((acc, ev) => {
          const key = ev.attendance_id || "no_attendance";
          if (!acc[key]) acc[key] = [];
          acc[key].push({
            id: `evidence-${ev._id}`,
            title: ev.title || "Không rõ",
            points: ev.faculty_point || 0,
            start_time: ev.submitted_at,
            end_time: ev.submitted_at,
            type: "Evidence",
            _id: ev._id,
            attendance_id: ev.attendance_id,
          });
          return acc;
        }, {});

        // --- Format attendance activities ---
        const rawAttendances = attendanceRes?.data?.data || [];
        const formattedActivities = rawAttendances.map((at) => ({
          id: at._id,
          title: at.title || "Không rõ",
          points: at.points || at.final_points || 0,
          start_time: at.start_time,
          end_time: at.end_time,
          type: "Attendance",
          evidences: evidenceMap[at._id] || [],
          attendance_id: at._id,
        }));

        // Nếu có evidence không gắn attendance
        if (evidenceMap["no_attendance"]) {
          formattedActivities.push(...evidenceMap["no_attendance"]);
        }

        setActivities(formattedActivities);

        // --- Format year records ---
        const formattedYears = (yearRes?.data || [])
          .sort((a, b) => a.year - b.year)
          .map((y) => ({
            record: y.total_point,
            start_year: y.year,
            end_year: y.year + 1,
          }));

        setYearRecords(formattedYears);

        // --- Summary ---
        setSummary({
          totalActivity: formattedActivities.length,
          totalScore: formattedYears.reduce((sum, y) => sum + y.record, 0),
        });
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu phục vụ cộng đồng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // --- Handle click feedback ---
  const handleFeedbackClick = async (activity) => {
    try {
      const res = await get_attendance_detail(studentId, activity.id);
      setSelectedActivity({
        ...activity,               // giữ title, points, type
        data: res?.data?.data || null, // chi tiết feedback
      });
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết phản hồi");
    }
  };

  // --- Handle submit feedback (giống bản chuẩn với attendance_id) ---
  const handleSubmitFeedback = async (formData) => {
    try {
      const res = await submit_feedback(
        selectedActivity.data._id,
        { feedback: formData.feedback }
      );
      if (res?.success) {
        alert("Gửi phản hồi thành công!");
      } else {
        alert(res?.message || "Gửi phản hồi thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setShowPopup(false);
    }
  };

  // --- Render action button ---
  const renderActions = (row) => (
    <button className="feedback-btn" onClick={() => handleFeedbackClick(row)}>
      Phản hồi
    </button>
  );

  // --- Prepare table data ---
  const tableData = activities.flatMap((a) => [
    {
      id: a.id,
      tên_hoạt_động: a.title,
      ngày_bắt_đầu: formatDate(a.start_time),
      ngày_kết_thúc: formatDate(a.end_time),
      điểm: a.points,
      loại: a.type,
    },
    ...(a.evidences || []).map((ev) => ({
      id: ev.id,
      tên_hoạt_động: `→ ${ev.title}`,
      ngày_bắt_đầu: formatDate(ev.start_time),
      ngày_kết_thúc: formatDate(ev.end_time),
      điểm: ev.points,
      loại: ev.type,
      _id: ev._id,
      attendance_id: ev.attendance_id,
    })),
  ]);

  return (
    <div className="pvcd-rercord-container">
      <Header />
      <Menu_student />
      <img className="dut-pic" src={dut_pic} alt="DUT" />

      <div className="cross-bar-pvcd-record">
        <p>Điểm phục vụ cộng đồng</p>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="total-record">
            <Total_Record score={summary.totalScore} num_activity={summary.totalActivity} />
          </div>

          <p className="goal-record">Mỗi năm tối thiểu {GOAL_RECORD} điểm</p>

          <List_Year_Record data={yearRecords} />

          <div className="activity-joined-container">
            <h3 className="activity-joined-title">Danh sách hoạt động & minh chứng</h3>

            <CustomTable
              columns={["Tên hoạt động", "Ngày bắt đầu", "Ngày kết thúc", "Điểm"]}
              data={tableData}
              renderActions={renderActions}
            />
          </div>
        </>
      )}

      {showPopup && selectedActivity && (
        <FeedbackPopup
          activity={selectedActivity.tên_hoạt_động}
          score={selectedActivity.điểm}
          data={selectedActivity.data}
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}

      <Footer />
    </div>
  );
}

export default PVCD_Record;
