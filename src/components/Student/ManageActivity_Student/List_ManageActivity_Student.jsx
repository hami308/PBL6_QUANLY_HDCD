
import "./List_ManageActivity_Student.css";
import activityImg from "../../../assets/images/activity.jpg";
import ManageActivity_Student from "./ManageActivity_Student.jsx";
import { Evaluate_Activity_Provider } from "../Evaluate_Activity/Evaluate_Activity_Context";
import {get_activities_by_idstudent} from "../../../services/Activity_Services";
import { useEffect,useState } from "react";
import {getStudentInfo} from "../../../services/Student/StudentInfor_Services.js";
function List_ManageActivity_Student() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    async function fetchActivities() {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("Không tìm thấy ID người dùng trong sessionStorage");
          return;
        }

        // Bước 1: Lấy thông tin sinh viên từ user.id
        
        const studentRes = await getStudentInfo(user.id);
        if (!studentRes) {
          console.error("Không tìm thấy sinh viên tương ứng với user.id");
          return;
        }

        const studentId = studentRes._id;

        // Bước 2: Gọi API lấy hoạt động theo studentId
        const res = await get_activities_by_idstudent(studentId);
        console.log("data",res.data.data);
        console.log("success",res.success);
        if (res?.success && res?.data.data) {
          const dataArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          const mappedData = dataArray.map((a) => ({
            id: a._id,
            name: a.title,
            org: a.organization?.name || "Không rõ đơn vị",
            start_time: new Date(a.start_time).toLocaleDateString("vi-VN"),
            end_time: new Date(a.end_time).toLocaleDateString("vi-VN"),
            location: a.location || "Chưa cập nhật",
            status: a.status || "Chưa rõ trạng thái",
            img: a.image || activityImg,
          }));

          setActivities(mappedData);
        } else {
          console.error("Lỗi khi lấy danh sách hoạt động:", res);
        }
      } catch (error) {
        console.error("Lỗi fetch API hoạt động:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);
  if (loading) {
    return <div className="loading">Đang tải danh sách hoạt động...</div>;
  }

  if (!activities.length) {
    return <div className="no-activity">Bạn chưa có hoạt động nào.</div>;
  }
  console.log("activities:", activities);

  return (
    <Evaluate_Activity_Provider>
      <div className="list-activity-student-container">
        {activities.map((activity) => (
        <ManageActivity_Student
          key={activity.id}
          id={activity.id}
          name_activity={activity.name}
          org={activity.org}
          start_time={activity.start_time}
          end_time={activity.end_time}
          location={activity.location}
          status={activity.status} 
          img={activity.img}         
        />
      ))}
      </div>
    </Evaluate_Activity_Provider>

  );
}

export default List_ManageActivity_Student;
