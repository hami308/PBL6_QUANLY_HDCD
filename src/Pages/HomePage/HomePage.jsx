import Filter_activity from "../../components/Activity/Filter_activity.jsx";
import Activity_list from "../../components/Activity/Activity_list.jsx";
import "./HomePage.css";
import Footer from "../../components/Footer/Footer.jsx";
import Header from "../../components/Header/Header.jsx";
import Menu_guest from "../../components/Menu/Menu_guest.jsx";
import dut_home_pic from "../../assets/images/dut_home_pic.jpg";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Menu_Admin from "../../components/Menu/Menu_Admin.jsx";


function HomePage() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return (
    <>
      <Header />
      {!user && <Menu_guest />}
      {user?.role === "student" && <Menu_student />}
      <div className="home-main">
        <div className="home-image-container">
          <img src={dut_home_pic} alt="DUT Home" className="home-image" />
        </div>
        <div className="home-container">
          <Filter_activity />
          <Activity_list />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
