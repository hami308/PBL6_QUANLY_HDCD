import Header from "../../components/Header/Header.jsx";
import Menu_Student from "../../components/Menu/Menu_student.jsx";
import StudentInfor from "../../components/Student/StudentInfor/StudentInfor.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
import Menu_org from "../../components/Menu/Menu_org"
import { useParams } from "react-router-dom";
function StudentInfor_Page() {
  const { id } = useParams();
  const role=sessionStorage.getItem("role");
  return (
    <>
      <Header />
      {role === "student" && <Menu_Student />}
      {role === "staff" && <Menu_org />}
      {role === "admin" && <Menu_Admin />}
      <StudentInfor idstudent={id} />
      <Footer />
    </>
  );
}
export default StudentInfor_Page;
