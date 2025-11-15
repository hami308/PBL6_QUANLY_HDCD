import "./ActivityDetails_Page.css";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ActivityList from "../../components/Activity/Activity_list.jsx";
import Activity_Details from "../../components/Activity/Activity_Details.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import See_List_Evaluate_Activity from "../../components/See_List_Evaluate_Activity/See_List_Evaluate_Activity.jsx";
import { get_details_activity_by_id } from "../../services/Activity_Services.js";

function Activity_details() {
  // Lấy thông tin user và vai trò
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ismodify = user?.role === "staff"; 

  const { id } = useParams(); // lấy id từ URL
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy chi tiết hoạt động
  useEffect(() => {
    async function fetchActivity() {
      try {
        const result = await get_details_activity_by_id(id);
        if (result.success) {
          setActivity(result.data);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu hoạt động:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [id]);

  // Hiển thị trong khi chờ dữ liệu
  if (loading) {
    return (
      <>
        <Header />
        {!user && <Menu_guest />}
        {user?.roles?.[0]?.role === "student" && <Menu_student />}
        {user?.roles?.[0]?.role === "admin" && <Menu_Admin />}
        {user?.roles?.[0]?.role === "staff" && <Menu_org />}
        <p className="loading">Đang tải dữ liệu hoạt động...</p>
        <Footer />
      </>
    );
  }

  // Nếu không có dữ liệu hoạt động
  if (!activity) {
    return (
      <>
        <Header />
        {!user && <Menu_guest />}
        {user?.roles?.[0]?.role === "student" && <Menu_student />}
        {user?.roles?.[0]?.role === "admin" && <Menu_Admin />}
        {user?.roles?.[0]?.role === "staff" && <Menu_org />}
        <p className="error">Không tìm thấy hoạt động.</p>
        <Footer />
      </>
    );
  }
  // Khi đã có dữ liệu
  return (
    <div className="activity-detail-page">
      <Header />
        {!user && <Menu_guest />}
        {user?.roles?.[0]?.role === "student" && <Menu_student />}
        {user?.roles?.[0]?.role === "admin" && <Menu_Admin />}
        {user?.roles?.[0]?.role === "staff" && <Menu_org />}

      <Activity_Details activity_details={activity.data} ismodify={ismodify} />

      {/* Nếu hoạt động đã tổ chức thì hiển thị danh sách đánh giá */}
      {activity.status === "Đã tổ chức" && <See_List_Evaluate_Activity />}

      {/* Nếu chưa đăng nhập thì hiển thị các hoạt động khác */}
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
    </div>
  );
}

export default Activity_details;
