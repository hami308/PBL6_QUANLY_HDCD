import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import AdminPermissionPanel from "./components/AdminPermissionPanel";
import "./Permission_Page.css";

/**
 * Admin Permission Management Page
 * PROTECTED: Only admin with permission:update can access
 */
const PermissionPage = () => {
  return (
    <div className="permissionPage">
      <Header />
      <Menu_Admin />

      <div className="page-container">
        <AdminPermissionPanel />
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default PermissionPage;
