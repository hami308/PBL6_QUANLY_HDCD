import Header from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_student";
import List_Activity_Create_QR from "../../components/Org/Create_QR_Attendance/List_Activity_create-qr";
import React from "react";
import "./Create_QR_Page.css";
function Create_QR_Page() {
    return (
        <>
            <Header />
            <Menu_org />
            <div className="background-create-qr"></div>
            <div className="cross-bar">
                <p>Danh sách các hoạt động đang tổ chức</p>
            </div>
            <List_Activity_Create_QR />
        </>
    );
}
export default Create_QR_Page;