import Filter_activity from "../../components/Activity/Filter_activity.jsx";
import Activity_list from "../../components/Activity/Activity_list.jsx";
import "./HomePage.css";
import Footer from "../../components/Footer/Footer.jsx";
import Header from "../../components/Header/Header.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import dut_home_pic from "../../assets/images/anhnen.jpg";
import { status_activity } from "../../data/status.js";
import { useState } from "react";

function HomePage() {
  // ✅ LẤY ROLE TỪ sessionStorage
  const role = sessionStorage.getItem("role");

  const [filters, setFilters] = useState({});

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header />

      {/* MENU */}
      {!role && <Menu_guest />}
      {role === "student" && <Menu_student />}
      {role === "admin" && <Menu_Admin />}
      {role === "staff" && <Menu_org />}

      <div className="home-main">
        <div className="home-image-container">
          <img src={dut_home_pic} alt="DUT Home" className="home-image" />
        </div>

        <div className="home-container">
          <Filter_activity
            status={status_activity}
            onFilter={handleFilter}
          />
          <Activity_list filters={filters} />
        </div>
      </div>

      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default HomePage;

