import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import Menu_org from"../../components/Menu/Menu_org";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import ChangePassword from "../../components/Student/ChangePassword/ChangePassword";
import Footer from "../../components/Footer/Footer";
function ChangePassword_Page() {
     const user = JSON.parse(sessionStorage.getItem("user"));
    return(
        <>
            <Header />
             {user?.roles?.[0]?.role === "student" && <Menu_student />}
             {user?.roles?.[0]?.role === "staff" && <Menu_org />}
             {user?.roles?.[0]?.role === "admin" && <Menu_Admin />}
            <ChangePassword />
            <Footer />
        </>
    );
}
export default ChangePassword_Page;