import Header from "../../components/Header/Header.jsx";
import Menu_Student from "../../components/Menu/Menu_student.jsx";
import StudentInfor from "../../components/Student/StudentInfor/StudentInfor.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Menu_Admin from "../../components/Menu_Admin/Menu_Admin.jsx";
function StudentInfor_Page() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return (
    <>
      <Header />
      {user?.role === "student" && <Menu_Student />}
      {user?.role === "admin" && <Menu_Admin />}
      <StudentInfor />
      <Footer />
    </>
  );
}
export default StudentInfor_Page;
