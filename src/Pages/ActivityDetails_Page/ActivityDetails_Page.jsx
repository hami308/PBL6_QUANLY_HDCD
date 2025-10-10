import "./ActivityDetails_Page.css";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { activity_list } from "../../data/activity_list.js"
// import { useParams } from "react-router-dom";
import Select from "react-select";
import {Faculty} from "../../data/Faculty.js";
// import { course } from "../../data/course.js";
// import React, { useState } from "react";
import ActivityList from "../../components/Activity/Activity_list.jsx";
import Activity_Details from "../../components/Activity/Activity_Details.jsx"


function Activity_details() {
  // get role
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ismodify = (user?.role === "org");  // nếu user = org thì cho phép sửa

//   const { id } = useParams();
  const activity = activity_list.find(act => act.id === "1");
//   const courseOptions = course.map(c => ({ value: c.id, label: c.name }));
//   const facultyOptions = Faculty.map(f => ({ value: f.id, label: f.name }));
//   /// Xử lý chuỗi -> mảng object { value, label }
//   const courseValues = activity.requirement_by_course
//     ? activity.requirement_by_course.split(",").map(c => {
//         const id = parseInt(c.trim(), 10);
//         const found = course.find(opt => opt.id === id);
//       return found ? { value: found.id, label: found.name } : { value: id, label: c };
//     })
//   : [];

// const facultyValues = activity.requirement_by_department
//   ? activity.requirement_by_department.split(",").map(f => {
//       const id = parseInt(f.trim(), 10);
//       const found = Faculty.find(opt => opt.id === id);
//       return found ? { value: found.id, label: found.name } : { value: id, label: f };
//     })
//   : [];
  
//   const [courseValuesState, setCourseValuesState] = useState(courseValues);
//   const [facultyValuesState, setFacultyValuesState] = useState(facultyValues);

  if (!activity) {
    return (
      <>
        <Header />
        {!user && <Menu_guest />}
        {user?.role === "student" && <Menu_student />}
        {/* {user?.role === "org" && <Menu_Guest />}  */}
        <div className="container">
          <p>Không tìm thấy hoạt động.</p>
        </div>
        <Footer />
      </>
    );
  }
 
  return (
    <>
      <Header />
      {!user && <Menu_guest />}
      {user?.role === "student" && <Menu_student />}
      <Activity_Details activity_details={activity} ismodify={ismodify}/>
      {/* nếu chưa đăng nhập mới hiển thị */}
      {!user && (
        <>
          {/* <Thanhngang value_titles="Các hoạt động khác" />
          <div className="other-activities">
            <ActivityList />
          </div> */}
        </>
      )}

      
      <Footer />
    </>
  );
}

export default Activity_details;
