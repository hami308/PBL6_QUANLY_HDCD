import Activity_details from "../../components/Student/Activity_Details/ActivityDetails_Student";
import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import React from "react";
const mockActivity = {
  title: "Chiến dịch Mùa Hè Xanh 2025",
  description:
    "Hoạt động tình nguyện hỗ trợ cộng đồng, trồng cây và dọn vệ sinh môi trường.",
  image: "",
  org_unit_id: { name: "Đoàn Thanh Niên Trường ABC" },

  start_time: "2025-06-10T08:00:00",
  end_time: "2025-06-10T17:00:00",

  registration_open: "2025-05-01",
  registration_close: "2025-05-30",

  field: "Tình nguyện cộng đồng",
  location: "Khu dân cư Bình An, Quận 9",

  student_status: "attendanced", // pending | approved | rejected | attendanced
  processed_time: "2025-05-28T14:30:00",
  attendance_time: "2025-06-10T08:05:00",
};

const ActivityDetails_Student = () => {
    return (
        <>
         <Header />
         <Menu_student />
         <Activity_details activity_details={mockActivity} /> 
          <Footer />
        </>
       
    );
};
export default ActivityDetails_Student;