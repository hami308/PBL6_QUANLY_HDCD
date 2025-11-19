import "./List_ManageActivity_Student.css";
import activityImg from "../../../assets/images/activity.jpg";
import ManageActivity_Student from "./ManageActivity_Student.jsx";
import { Evaluate_Activity_Provider } from "../Evaluate_Activity/Evaluate_Activity_Context";
import { get_activities_by_idstudent, filter_activities_by_student } from "../../../services/Activity_Services";
import { useEffect, useState } from "react";
import { getStudentInfo } from "../../../services/Student/StudentInfor_Services.js";

function List_ManageActivity_Student({ filters }) {
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

        let res;
        // Kiểm tra xem có filters không
        if (Object.keys(filters).length > 0) {
          // Gọi API lọc
          res = await filter_activities_by_student(studentId, filters);
        } else {
          // Gọi API lấy tất cả
          res = await get_activities_by_idstudent(studentId);
        }

        if (res?.success) {
          // Xử lý dữ liệu từ cả hai API
          let dataArray = [];
          if (res.data.data) {
            dataArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          } else if (res.data) {
            dataArray = Array.isArray(res.data) ? res.data : [res.data];
          }

          const mappedData = dataArray.map((a) => ({
            id: a._id,
            name: a.title,
            org: a.org_unit_name || a.org_unit_id?.name || "Không rõ đơn vị",
            start_time: new Date(a.start_time).toLocaleDateString("vi-VN"),
            end_time: new Date(a.end_time).toLocaleDateString("vi-VN"),
            location: a.location || "Chưa cập nhật",
            status: a.registration.status || "Chưa rõ trạng thái",
            img: a.image || a.activity_image || activityImg,
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
  }, [filters]); // Thêm filters vào dependency

  if (loading) {
    return <div className="loading">Đang tải danh sách hoạt động...</div>;
  }

  if (!activities.length) {
    return <div className="no-activity">Không tìm thấy hoạt động nào phù hợp.</div>;
  }

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