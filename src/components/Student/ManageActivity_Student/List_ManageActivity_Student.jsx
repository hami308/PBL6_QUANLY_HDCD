
import "./List_ManageActivity_Student.css";
import activityImg from "../../../assets/images/activity.jpg";
import ManageActivity_Student from "./ManageActivity_Student.jsx";
import { Evaluate_Activity_Provider } from "../Evaluate_Activity/Evaluate_Activity_Context";

function List_ManageActivity_Student() {
  const activities = [
    {
      id: 1,
      name: "Hiến máu nhân đạo",
      org: "Câu lạc bộ Công tác xã hội",
      date: "15/9/2025",
      location: "Khu B ĐHBK",
      status: "Đã đăng ký",
      img: activityImg,
    },
    {
      id: 2,
      name: "Hiến máu nhân đạo",
      org: "Đoàn trường Đại học Bách Khoa",
      date: "15/9/2025",
      location: "Khu B ĐHBK",
      status: "Đã tham gia",
      point: 5,
      img: activityImg,
    },
    {
      id: 3,
      name: "Hiến máu nhân đạo",
      org: "Câu lạc bộ Thanh niên tình nguyện",
      date: "15/9/2025",
      location: "Khu B ĐHBK",
      status: "Đã được duyệt",
      img: activityImg,
    },
    {
      id: 4,
      name: "Hiến máu nhân đạo",
      org: "Câu lạc bộ Công tác xã hội",
      date: "15/9/2025",
      location: "Khu B ĐHBK",
      status: "Đã được duyệt",
      img: activityImg,
    },
  ];

  return (
    <Evaluate_Activity_Provider>
      <div className="list-activity-student-container">
        {activities.map((activity) => (
        <ManageActivity_Student
          key={activity.id}
          name_activity={activity.name}
          org={activity.org}
          date={activity.date}
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
