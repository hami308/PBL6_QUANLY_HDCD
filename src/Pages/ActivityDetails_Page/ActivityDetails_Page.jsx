import "./ActivityDetails_Page.css";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { activity_list } from "../../data/activity_list.js"
import ActivityList from "../../components/Activity/Activity_list.jsx";
import Activity_Details from "../../components/Activity/Activity_Details.jsx"
import { useParams  } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import See_List_Evaluate_Activity from "../../components/See_List_Evaluate_Activity/See_List_Evaluate_Activity.jsx";
function Activity_details() {
  // get role
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ismodify = (user?.role === "org");  // nếu user = org thì cho phép sửa
  const { id } = useParams();
  const activity = activity_list.find(act => act.id === id);
  // const navigate = useNavigate();

  return (
    <>
      <Header />
      {!user && <Menu_guest />}
      {user?.role === "student" && <Menu_student />}
      {/* Nút trở về */}
      {/* <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">
            arrow_back
          </span> 
        </button>
      </div> */}
      <Activity_Details activity_details={activity} ismodify={ismodify} />
     
      {/* nếu chưa đăng nhập mới hiển thị */}  
      
   
       {activity.status==="Đã tổ chức" &&(
        <See_List_Evaluate_Activity/>
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
    </>
  );
}

export default Activity_details;
