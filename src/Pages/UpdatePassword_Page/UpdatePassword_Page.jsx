import Header from "../../components/Header/Header";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import MenuAdmin from "../../components/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import "./UpdatePassword_Page.css";
function UpdatePassword_Page() {
  return (
    <>
      <Header />
      <MenuAdmin />
      <div className="update-password-container">
        <UpdatePassword />
      </div>

      <Footer />
    </>
  );
}

export default UpdatePassword_Page;
