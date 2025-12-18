import Filter_activity from "../../components/Activity/Filter_activity.jsx";
import Activity_list from "../../components/Activity/Activity_list.jsx";
import "./HomePage.css";
import Footer from "../../components/Footer/Footer.jsx";
import Header from "../../components/Header/Header.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import dut_home_pic from "../../assets/images/anhnen.jpg";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import { status_activity } from "../../data/status.js";
import { useState } from "react"; // Thêm import
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton.jsx";
function HomePage() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [filters, setFilters] = useState({}); // State để lưu filters

  // Hàm xử lý khi filter thay đổi
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header />
      {!user && <Menu_guest />}
      {user?.roles?.[0]?.role === "student" && <Menu_student />}
      {user?.roles?.[0]?.role === "admin" && <Menu_Admin />}
      {user?.roles?.[0]?.role === "staff" && <Menu_org />}
      <div className="home-main">
        <div className="home-image-container">
          <img src={dut_home_pic} alt="DUT Home" className="home-image" />
        </div>
        <div className="home-container">
          {/* Truyền hàm handleFilter xuống Filter_activity */}
          <Filter_activity status={status_activity} onFilter={handleFilter} />
          {/* Truyền filters xuống Activity_list */}
          <Activity_list filters={filters} />
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default HomePage;
