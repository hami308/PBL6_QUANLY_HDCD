import Header from "../../components/Header/Header.jsx";
//import Menu_Teacher from "../../components/Menu/Menu_student.jsx";
import TeacherInfor from "../../components/Teacher/TeacherInfor.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
function TeacherInfor_Page() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return (
    <>
      <Header />
      {/* {user?.role === "teacher" && <Menu_Teacher />} */}
      {user?.role === "admin" && <Menu_Admin />}
      <TeacherInfor />
      <Footer />
    </>
  );
}
export default TeacherInfor_Page;
