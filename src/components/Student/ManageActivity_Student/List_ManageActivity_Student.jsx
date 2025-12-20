import "./List_ManageActivity_Student.css";
import activityImg from "../../../assets/images/activity.jpg";
import ManageActivity_Student from "./ManageActivity_Student.jsx";
import { Evaluate_Activity_Provider } from "../Evaluate_Activity/Evaluate_Activity_Context";
import {
  get_activities_by_idstudent,
  filter_activities_by_student,
} from "../../../services/Activity_Services";
import { useEffect, useState } from "react";
import { getStudentInfo } from "../../../services/Student/StudentInfor_Services.js";

function List_ManageActivity_Student({ filters }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // tránh setState khi component unmount

    async function fetchActivities() {
      setLoading(true); // ⭐ BẬT LOADING MỖI KHI FILTER THAY ĐỔI

      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user?.id) {
          console.error("Không tìm thấy user trong sessionStorage");
          return;
        }

        /* ================== GET STUDENT ================== */
        const studentRes = await getStudentInfo(user.id);
        if (!studentRes?._id) {
          console.error("Không tìm thấy sinh viên");
          return;
        }

        const studentId = studentRes._id;

        /* ================== FETCH ACTIVITY ================== */
        const hasFilter = filters && Object.keys(filters).length > 0;

        const res = hasFilter
          ? await filter_activities_by_student(studentId, filters)
          : await get_activities_by_idstudent(studentId);

        if (!res?.success) {
          console.error("Lỗi khi lấy danh sách hoạt động:", res);
          return;
        }

        /* ================== NORMALIZE DATA ================== */
        const rawData =
          res.data?.data ??
          res.data ??
          [];

        const dataArray = Array.isArray(rawData) ? rawData : [rawData];

        const mappedData = dataArray.map((a) => {
          let status = "Không rõ trạng thái";

          if (a.attendance) {
            status = "Đã tham gia";
          } else if (a.registration?.status) {
            switch (a.registration.status) {
              case "pending":
                status = "Đã đăng ký";
                break;
              case "approved":
                status = "Đã duyệt";
                break;
              case "rejected":
                status = "Đã từ chối";
                break;
              default:
                status = "Không rõ trạng thái";
            }
          }

          return {
            id: a._id,
            name: a.title,
            org: a.org_unit_name || a.org_unit_id?.name || "Không rõ đơn vị",
            start_time: new Date(a.start_time).toLocaleDateString("vi-VN"),
            end_time: new Date(a.end_time).toLocaleDateString("vi-VN"),
            location: a.location || "Chưa cập nhật",
            status,
            img: a.image || a.activity_image || activityImg,
          };
        });

        if (isMounted) {
          setActivities(mappedData);
        }
      } catch (error) {
        console.error("Lỗi fetch API hoạt động:", error);
      } finally {
        if (isMounted) {
          setLoading(false); // ⭐ TẮT LOADING SAU KHI XONG
        }
      }
    }

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, [filters]); // ⭐ FILTER THAY ĐỔI → RE-FETCH + LOADING

  /* ================== UI ================== */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="no-activity">
        Không tìm thấy hoạt động nào phù hợp.
      </div>
    );
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
