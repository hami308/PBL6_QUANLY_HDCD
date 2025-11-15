import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Total_Record from "../../components/PVCD_Record/Total_Record.jsx";
import List_Year_Record from "../../components/PVCD_Record/List_Year_Record.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import FeedbackPopup from "../../components/Popup/FeedbackPopup.jsx";
import dut_pic from "../../assets/images/anhnen.jpg";
import { get_attendance_by_idstudent } from "../../services/Attendance_Services.js";
import "./PVCD_Record.css";

function PVCD_Record() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const studentId = sessionStorage.getItem("student_id");
  const goal_record = 15;

  const formatDate = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleDateString("vi-VN"); // -> 30/09/2025
  };

  // Gọi API khi component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await get_attendance_by_idstudent(studentId);
        console.log(response.data.data);
         setActivities(response.data.data || []); 
      } catch (err) {
        console.error(err);
        setError("Lỗi khi lấy dữ liệu hoạt động");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [studentId]);

  // Xử lý khi click nút phản hồi
  const handleFeedbackClick = (activity) => {
    setSelectedActivity(activity);
    setShowPopup(true);
  };

  // Xử lý gửi phản hồi
  const handleSubmitFeedback = (data) => {
    console.log("Phản hồi gửi đi:", data);
    // TODO: Gửi lên server
    setShowPopup(false);
  };

  return (
    <div className="pvcd-rercord-container">
      <Header />
      <Menu_student />

      <img className="dut-pic" src={dut_pic} alt="DUT" />

      <div className="cross-bar-pvcd-record">
        <p>Điểm phục vụ cộng đồng</p>
      </div>

      <div className="total-record">
        <Total_Record />
      </div>

      <p className="goal-record">Mỗi năm tối thiểu {goal_record} điểm</p>

      <List_Year_Record />

      <div className="activity-joined-container">
        <h3 className="activity-joined-title">Danh sách hoạt động đã tham gia</h3>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : activities.length === 0 ? (
          <p>Chưa tham gia hoạt động nào</p>
        ) : (
          <CustomTable
            columns={["Tên hoạt động", "Ngày bắt đầu","Ngày kết thúc", "Điểm"]}
            data={activities.map((item) => ({
              tên_hoạt_động: item.title,
              ngày_bắt_đầu: formatDate(item.start_time),
              ngày_kết_thúc: formatDate(item.end_time),
              điểm: item.score,
            }))}
            renderActions={(item) => (
              <button
                className="px-2 py-1 border rounded"
                onClick={() => handleFeedbackClick(item)}
              >
                Phản hồi
              </button>
            )}
          />
        )}
      </div>

      {showPopup && selectedActivity && (
        <FeedbackPopup
          activity={selectedActivity["tên_hoạt_động"]}
          score={selectedActivity["điểm"]}
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}

      <Footer />
    </div>
  );
}

export default PVCD_Record;
