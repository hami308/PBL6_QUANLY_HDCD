import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import dut_pic from "../../assets/images/anhnen.jpg";
import Footer from "../../components/Footer/Footer.jsx";
import Total_Record from "../../components/PVCD_Record/Total_Record.jsx";
import List_Year_Record from "../../components/PVCD_Record/List_Year_Record.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import "./PVCD_Record.css";
function PVCD_Record() {
    const activities = [
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
      { studentId: "102200001", name_activity: "Hiến máu nhân đạo", join_date: "20/9/2025", score: 15 },
    ];
  const goal_record = 15;
  return (
    <>
        <Header />
        <Menu_student />
        <img className="dut-pic" src={dut_pic} alt="DUT" />
         <div className="cross-bar-PVCD-record" style={{height:"100px"}}>
            <p>Điểm phục vụ cộng đồng</p>
        </div>
        <div className="total-record" >
          <Total_Record/>
        </div>
        <p className="goal-record"> Mỗi năm tối thiểu {goal_record} điểm</p>
        <List_Year_Record/>
        <div className="activity-joined-container">
        <h3 className="activity-joined-title">Danh sách hoạt động đã tham gia</h3>
        <CustomTable
          columns={["Tên hoạt động", "Ngày tham gia", "Điểm"]}
          data={activities.map((item) => ({
            tên_hoạt_động: item.name_activity,
            ngày_tham_gia: item.join_date,
            điểm: item.score,
          }))}
            renderActions={() => (
              <>
                <button className="px-2 py-1 border rounded">Phản hồi</button>
              
              </>
          )}
        />
        </div>
        <Footer />
    </>
  );
}
export default PVCD_Record;