import "./ActivityDetails_Page.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ActivityList from "../../components/Activity/Activity_list.jsx";
import Activity_Details from "../../components/Activity/Activity_Details.jsx";
import See_List_Evaluate_Activity from "../../components/See_List_Evaluate_Activity/See_List_Evaluate_Activity.jsx";
import { get_details_activity_by_id } from "../../services/Activity_Services.js";
import { get_feedback_by_activity } from "../../services/Feedback_Services.js";
import ScrollToTopOnMount from "../../components/ScrollToTopButton/ScrollToTopButton.jsx";

function Activity_details() {
  const role = sessionStorage.getItem("role");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ismodify = role === "staff";

  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH DATA =====
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const [activityRes, feedbackRes] = await Promise.all([
          get_details_activity_by_id(id),
          get_feedback_by_activity(id),
        ]);

        if (activityRes?.success) {
          setActivity(activityRes.data);
        } else {
          setActivity(null);
          console.error(activityRes?.message);
        }

        if (feedbackRes?.success) {
          setFeedback(feedbackRes.data?.data?.feedbacks || []);
        } else {
          setFeedback([]);
          console.error(feedbackRes?.message);
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
        setActivity(null);
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // ===== MENU RENDER =====
  const renderMenu = () => {
    if (!user) return <Menu_guest />;
    if (role === "student") return <Menu_student />;
    if (role === "admin") return <Menu_Admin />;
    if (role === "staff") return <Menu_org />;
    return null;
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="activity-detail-page">
        <Header />
        {renderMenu()}
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // ===== NOT FOUND =====
  if (!activity) {
    return (
      <div className="activity-detail-page">
        <Header />
        {renderMenu()}
        <p className="loading">Không tìm thấy hoạt động.</p>
        <Footer />
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <div className="activity-detail-page">
      <Header />
      {renderMenu()}

      <Activity_Details activity_details={activity.data} ismodify={ismodify} />

      {activity.data?.status === "Đã tổ chức" && (
        <See_List_Evaluate_Activity reviews={feedback} />
      )}

      {!user && (
        <>
          <div className="other-activity-content">
            <p>Các hoạt động khác</p>
          </div>
          <div className="other-activities">
            <ActivityList />
          </div>
        </>
      )}
      <Footer />
      <ScrollToTopOnMount />
    </div>
  );
}

export default Activity_details;
