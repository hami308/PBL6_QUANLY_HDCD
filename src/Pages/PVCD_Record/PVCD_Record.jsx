import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import dut_pic from "../../assets/images/dut_home_pic.jpg";
import Footer from "../../components/Footer/Footer.jsx";
import Total_Record from "../../components/PVCD_Record/Total_Record.jsx";
import Year_Record from "../../components/PVCD_Record/Year_Record.jsx";
import "./PVCD_Record.css";
function PVCD_Record() {
  return (
    <>
        <Header />
        <Menu_student />
        <img className="dut-pic" src={dut_pic} alt="DUT" />
         <div className="cross-bar">
            <p>Điểm phục vụ cộng đồng</p>
        </div>
        <Total_Record/>
        <Year_Record/>
        <Footer />
        
    </>
  );
}
export default PVCD_Record;