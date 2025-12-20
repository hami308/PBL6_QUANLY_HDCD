import { useState, useEffect } from "react";
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

import { get_pvcd_by_idstudent } from "../../services/PVCD_Service.js";

import "./PVCD_Record.css";

function PVCD_Record() {
  const studentId = sessionStorage.getItem("student_id");
  const goal_record = 15;

  const [activities, setActivities] = useState([]);
  const [yearRecords, setYearRecords] = useState([]);

  const [summary, setSummary] = useState({
    totalScore: 0,
    totalActivity: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorActivities, setErrorActivities] = useState(null);
  const [errorYear, setErrorYear] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN");
  };

  // ===== LOAD ALL DATA (1 LOADING) =====
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [activityRes, yearRes] = await Promise.all([
          get_attendance_by_idstudent(studentId),
          get_pvcd_by_idstudent(studentId),
        ]);

        // ===== ACTIVITIES =====
        const rawActivities = activityRes?.data?.data || [];
        const formattedActivities = rawActivities.map((item) => ({
          id: item._id,
          title: item.title || "Không rõ",
          points: item.points,
          start_time: item.start_time,
          end_time: item.end_time,
          attendance_id: item.attendance_id,
        }));

        setActivities(formattedActivities);
        setSummary((prev) => ({
          ...prev,
          totalActivity: formattedActivities.length,
        }));

        // ===== YEAR RECORD =====
        const rawYears = yearRes?.data || [];
        const formattedYears = rawYears.map((item) => ({
          record: item.total_point,
          start_year: new Date(item.start_year).getFullYear(),
          end_year: new Date(item.end_year).getFullYear(),
        }));

        setYearRecords(formattedYears);

        const totalScore = formattedYears.reduce(
          (sum, r) => sum + r.record,
          0
        );

        setSummary((prev) => ({
          ...prev,
          totalScore,
        }));
      } catch (err) {
        console.error("Err:", err);
        setErrorActivities("Lỗi khi tải danh sách hoạt động");
        setErrorYear("Không thể tải dữ liệu năm");
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) fetchAllData();
  }, [studentId]);

  // ===== FEEDBACK =====
  const handleFeedbackClick = async (activity) => {
    try {
      const detail = await get_attendance_detail(studentId, activity.id);
      setSelectedActivity({
        ...activity,
        data: detail?.data?.data || "",
      });
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết phản hồi");
    }
  };

  const handleSubmitFeedback = async (data) => {
    try {
      const res = await submit_feedback(selectedActivity.attendance_id, {
        feedback: data.feedback,
      });

      if (res?.success) {
        alert("Gửi phản hồi thành công!");
      } else {
        alert(res?.message || "Gửi phản hồi thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống, thử lại sau");
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="pvcd-rercord-container">
      <Header />
      <Menu_student />

      <img className="dut-pic" src={dut_pic} alt="DUT" />

      <div className="cross-bar-pvcd-record">
        <p>Điểm phục vụ cộng đồng</p>
      </div>

      {/* ===== SINGLE LOADING ===== */}
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* ===== SUMMARY ===== */}
          <div className="total-record">
            <Total_Record
              score={summary.totalScore}
              num_activity={summary.totalActivity}
            />
          </div>

          <p className="goal-record">
            Mỗi năm tối thiểu {goal_record} điểm
          </p>

          {/* ===== YEAR RECORD ===== */}
          {errorYear ? (
            <p className="error-message">{errorYear}</p>
          ) : (
            <List_Year_Record data={yearRecords} />
          )}

          {/* ===== ACTIVITY LIST ===== */}
          <div className="activity-joined-container">
            <h3 className="activity-joined-title">
              Danh sách hoạt động đã tham gia
            </h3>

            {errorActivities ? (
              <p className="error-message">{errorActivities}</p>
            ) : activities.length === 0 ? (
              <p>Chưa tham gia hoạt động nào</p>
            ) : (
              <CustomTable
                columns={[
                  "Tên hoạt động",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Điểm",
                ]}
                data={activities.map((item) => ({
                  id: item.id,
                  tên_hoạt_động: item.title,
                  ngày_bắt_đầu: formatDate(item.start_time),
                  ngày_kết_thúc: formatDate(item.end_time),
                  điểm: item.points,
                }))}
                renderActions={(row) => {
                  const origin = activities.find(
                    (a) => a.id === row.id
                  );
                  return (
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => handleFeedbackClick(origin)}
                    >
                      Phản hồi
                    </button>
                  );
                }}
              />
            )}
          </div>
        </>
      )}

      {/* ===== FEEDBACK POPUP ===== */}
      {showPopup && selectedActivity && (
        <FeedbackPopup
          activity={selectedActivity.title}
          score={selectedActivity.points}
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
