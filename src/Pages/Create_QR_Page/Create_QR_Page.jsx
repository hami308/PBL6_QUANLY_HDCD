import Header from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_org";
import List_Activity_Create_QR from "../../components/Org/Create_QR_Attendance/List_Activity_Create-QR";
import React from "react";
import "./Create_QR_Page.css";
import Footer from "../../components/Footer/Footer";
function Create_QR_Page() {
  return (
    <div className="create-qr-page">
      <Header />
      <Menu_org />
      <div className="background-create-qr"></div>
      <div className="cross-bar">
        <p>Danh sách các hoạt động đang tổ chức</p>
      </div>
      <div className="list-activity-create-qr-container">
          <List_Activity_Create_QR />
      </div>

      <Footer/>
    </div>
  );
}
export default Create_QR_Page;
