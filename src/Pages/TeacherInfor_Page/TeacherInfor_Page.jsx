import Header from "../../components/Header/Header.jsx";
import Menu_Teacher from "../../components/Menu/Menu_student.jsx";
import TeacherInfor from "../../components/Teacher/TeacherInfor.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
import Menu_org from "../../components/Menu/Menu_org"
import { useParams } from "react-router-dom";
function TeacherInfor_Page() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const { id } = useParams();
  return (
    <>
      <Header />
      {user?.roles?.[0]?.role === "staff" && <Menu_org />}
      {user?.roles?.[0]?.role === "admin" && <Menu_Admin />}
      <TeacherInfor idstaff={id} />
      <Footer />
    </>
  );
}
export default TeacherInfor_Page;
