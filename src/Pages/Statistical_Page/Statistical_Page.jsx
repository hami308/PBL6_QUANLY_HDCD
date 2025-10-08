// src/pages/Statistical_Page/Statistical_Page.jsx
import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Menu_Admin/Menu_Admin";
import Filter_Admin from "../../components/Filter_Admin/Filter_Admin";
import InfoCard from "../../components/InfoCard/InfoCard";
import CustomTable from "../../components/Custom/CustomTable";
import Footer from "../../components/Footer/Footer";
import "./Statistical_Page.css";

function Statistical_Page({ activeTab }) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  // 📊 Dữ liệu mẫu cho điểm sinh viên
  const students = [
    {
      studentId: "SV001",
      name: "Nguyễn Văn A",
      class: "CTK44",
      faculty: "Công nghệ thông tin",
      score: 85,
      status: "Đạt",
    },
    {
      studentId: "SV002",
      name: "Trần Thị B",
      class: "CTK44",
      faculty: "Công nghệ thông tin",
      score: 70,
      status: "Không đạt",
    },
  ];

  // 📊 Dữ liệu mẫu cho hoạt động
  const activities = [
    {
      id: "HD001",
      name: "Hội thảo AI",
      date: "20/03/2024",
      org: "Khoa CNTT",
      status: "Đã duyệt",
    },
    {
      id: "HD002",
      name: "Ngày hội việc làm",
      date: "05/06/2024",
      org: "Phòng CTSV",
      status: "Chờ duyệt",
    },
  ];

  return (
    <div className="statistical-page">
      <Header />
      <Menu_Admin />

      <Filter_Admin activeTab={activeTab} />

      <div className="tabs-content">
        {/* Nút xuất file */}
        <div className="export-section">
          <button
            className="export-btn"
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            Xuất file
          </button>
          <div className={`export-dropdown ${showExportOptions ? "show" : ""}`}>
            <div className="export-option">Excel</div>
            <div className="export-option">CSV</div>
            <div className="export-option">PDF</div>
          </div>
        </div>

        {/* Thẻ thống kê chung */}
        <div className="info-cards-container">
          <InfoCard icon="👥" title="Tổng số sinh viên" value="1912" />
          <InfoCard icon="📊" title="Điểm trung bình" value="50" />
          <InfoCard icon="🏆" title="Điểm cao nhất" value="30" />
        </div>

        {/* Bảng hiển thị */}
        {activeTab === "Score" && (
          <>
            <div className="tab-title">Bảng điểm chi tiết</div>
            <CustomTable
              columns={[
                "Mã sinh viên",
                "Họ tên",
                "Lớp",
                "Khoa",
                "Điểm số",
                "Đạt/Không đạt",
              ]}
              data={students.map((s) => ({
                mã_sinh_viên: s.studentId,
                họ_tên: s.name,
                lớp: s.class,
                khoa: s.faculty,
                điểm_số: s.score,
                đạt_không_đạt: s.status,
              }))}
            />
          </>
        )}

        {activeTab === "Activity" && (
          <>
            <div className="tab-title">Bảng thông tin hoạt động</div>
            <CustomTable
              columns={[
                "ID hoạt động",
                "Tên hoạt động",
                "Ngày tổ chức",
                "Đơn vị tổ chức",
                "Trạng thái",
              ]}
              data={activities.map((a) => ({
                id_hoạt_động: a.id,
                tên_hoạt_động: a.name,
                ngày_tổ_chức: a.date,
                đơn_vị_tổ_chức: a.org,
                trạng_thái: a.status,
              }))}
            />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Statistical_Page;
