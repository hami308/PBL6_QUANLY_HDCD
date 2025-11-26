// src/pages/Statistical_Page/Statistical_Page.jsx
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import InfoCard from "../../components/Admin/InfoCard/InfoCard";
import CustomTable from "../../components/Custom/CustomTable";
import Footer from "../../components/Footer/Footer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import "./Statistical_Page.css";
// import { getAllRecord } from "../../services/StatisticService/Statistic_records";
import { get_all_activities } from "../../services/Activity_Services";
import { activiti_dashboard } from "../../services/StatisticService/Statistic_activity";
import { score_dashboard } from "../../services/StatisticService/Statistic_records";
function Statistical_Page({ activeTab }) {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [Dashboard, setDashboard] = useState({
    totalActivities: 0,
    activitiesThisYear: 0,
    activitiesPreviousYear: 0,
    growthPercentage: 0,
  });
  const [ScoreDashboard, setScoreDashboard] = useState({
    total_students: 0,
    average_points: 0,
    max_points: 0,
  });
  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const data = await getAllRecord();
  //       setStudents(data);
  //       console.log("Data records:", data);
  //     } catch (error) {
  //       console.error("Error fetching records:", error);
  //     }
  //   };

  //   fetchRecords();
  // }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await activiti_dashboard();
        setDashboard(res.data);
      } catch (error) {
        console.error("Lỗi fetching dashboard:", error);
      }
    };
    const fetchScoreDashboard = async () => {
      try {
        const res = await score_dashboard();
        setScoreDashboard(res.data.statistics);
        setStudents(res.data.records);
        console.log("Dashboard", res);
      } catch (error) {
        console.error("Lỗi fetching dashboard:", error);
      }
    };
    fetchScoreDashboard();
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await get_all_activities();
        // console.log("Fetch activities response:", res);
        if (res.success) {
          setActivities(res.data.data);
        }
        // console.log("Data activities:", res);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleScoreFilter = async (filters) => {
    try {
      const token = sessionStorage.getItem("token");

      const query = new URLSearchParams({
        student_number: filters.studentCode || "",
        faculty_id: filters.idfaculty || "",
        class_id: filters.selectedClass || "",
        academic_year: filters.academicYear || "",
      });

      const url = `https://pbl6-backend.vercel.app/api/statistics/grades?${query.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data?.data) {
        setScoreDashboard(data.data.statistics);
        setStudents(data.data.records);
        console.log("Filtered Score:", data.data);
      }
    } catch (error) {
      console.error("Lỗi filter:", error);
    }
  };

  const getExportData = () => {
    if (activeTab === "Score") {
      return students.map((s) => ({
        "Mã sinh viên": s.student.student_number,
        "Họ tên": s.student.full_name,
        Lớp: s.class.name,
        Khoa: s.faculty.name,
        "Điểm số": s.total_point,
      }));
    }

    if (activeTab === "Activity") {
      return activities.map((a) => ({
        "Tên hoạt động": a.title,
        "Ngày tổ chức": a.start_time_updated,
        "Ngày kết thúc": a.end_time_updated,
        "Đơn vị tổ chức": a.org_unit_id?.name,
        "Địa chỉ tổ chức": a.location,
        "Trạng thái": a.status,
      }));
    }

    return [];
  };
  const handleExportExcel = () => {
    const exportData = getExportData();

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `${activeTab}_export.xlsx`);
  };

  return (
    <div className="statistical-page">
      <Header />
      <Menu_Admin />
      <Filter_Admin activeTab={activeTab} onFilterApply={handleScoreFilter} />

      <div className="tabs-content">
        {/* Thẻ thống kê chung */}
        {activeTab === "Score" && (
          <div className="info-cards-container">
            <InfoCard
              icon="👥"
              title="Tổng số sinh viên"
              value={ScoreDashboard.total_students}
            />
            <InfoCard
              icon="📊"
              title="Điểm trung bình"
              value={ScoreDashboard.average_points}
            />
            <InfoCard
              icon="🏆"
              title="Điểm cao nhất"
              value={ScoreDashboard.max_points}
            />
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="info-cards-container">
            <InfoCard
              icon="👥"
              title="Tổng hoạt động"
              value={Dashboard.totalActivities}
            />
            <InfoCard
              icon="📊"
              title="Số hoạt động năm nay"
              value={Dashboard.activitiesThisYear}
            />
            <InfoCard
              icon="🏆"
              title="Tăng so với năm trước"
              value={`${Dashboard.growthPercentage}%`}
            />
          </div>
        )}

        {/* Nút xuất file */}
        <div className="export-section">
          <button className="export-btn" onClick={handleExportExcel}>
            Xuất file
          </button>
        </div>
        {/* Bảng hiển thị */}
        {activeTab === "Score" && (
          <>
            <div className="tab-title">Bảng điểm chi tiết</div>
            <div className="table_1">
              <CustomTable
                columns={["Mã sinh viên", "Họ tên", "Khoa", "Lớp", "Điểm số"]}
                data={students.map((s) => ({
                  mã_sinh_viên: s.student.student_number,
                  họ_tên: s.student.full_name,

                  khoa: s.faculty.name,
                  lớp: s.class.name,
                  điểm_số: s.total_point,
                }))}
              />
            </div>
          </>
        )}

        {activeTab === "Activity" && (
          <>
            <div className="tab-title">Bảng thông tin hoạt động</div>
            <div className="table_1">
              <CustomTable
                columns={[
                  "Tên hoạt động",
                  "Ngày tổ chức",
                  "Ngày kết thúc",
                  "Đơn vị tổ chức",
                  "Địa chỉ tổ chức",
                  "Trạng thái",
                ]}
                data={activities.map((a) => ({
                  tên_hoạt_động: a.title,
                  ngày_tổ_chức: a.start_time_updated,
                  ngày_kết_thúc: a.end_time_updated,
                  đơn_vị_tổ_chức: a.org_unit_id?.name,
                  địa_chỉ_tổ_chức: a.location,
                  trạng_thái: a.status,
                }))}
              />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Statistical_Page;
