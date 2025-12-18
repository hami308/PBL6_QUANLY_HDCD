import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import Menu_org from"../../components/Menu/Menu_org";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import ChangePassword from "../../components/Student/ChangePassword/ChangePassword";
import Footer from "../../components/Footer/Footer";
function ChangePassword_Page() {
     const role = sessionStorage.getItem("role");
    return(
        <>
            <Header />
             {role === "student" && <Menu_student />}
             {role === "staff" && <Menu_org />}
             {role === "admin" && <Menu_Admin />}
            <ChangePassword />
            <Footer />
        </>
    );
}
export default ChangePassword_Page;