// src/pages/Statistical_Page/Statistical_Page.jsx
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import InfoCard from "../../components/Admin/InfoCard/InfoCard";
import CustomTable from "../../components/Custom/CustomTable";
import Footer from "../../components/Footer/Footer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Statistical_Page.css";

import { get_all_activities } from "../../services/Activity_Services";
import { filter_activity_dashboard } from "../../services/StatisticService/Statistic_activity";
import { filter_grades } from "../../services/StatisticService/Statistic_records";

// =====================
// Utility: Format datetime
// =====================
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function Statistical_Page({ activeTab }) {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [loading, setLoading] = useState(false);

  const [Dashboard, setDashboard] = useState({
    totalActivities: 0,
  });

  const [ScoreDashboard, setScoreDashboard] = useState({
    total_students: 0,
    average_points: 0,
    max_points: 0,
  });

  // ============================
  // Fetch activities: only when tab Activity load
  // ============================
  useEffect(() => {
    if (activeTab !== "Activity") return;

    const fetchActivities = async () => {
      try {
        const res = await get_all_activities();
        if (res.success) setActivities(res.data.data);
        setDashboard({
          totalActivities: res.data.data.length,
        });
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [activeTab]);

  // ============================
  // Filter: Score
  // ============================
  const handleScoreFilter = useCallback(async (filters) => {
    setIsFiltered(true);
    setLoading(true);

    try {
      const res = await filter_grades({
        studentCode: filters.studentCode,
        idfaculty: filters.idfaculty,
        selectedClass: filters.selectedClass,
        academicYear: filters.academicYear,
      });

      if (res?.data) {
        setScoreDashboard(res.data.statistics);
        setStudents(res.data.records);
        console.log("Filtered students:", res.data.records);
      }
    } catch (e) {
      console.error("Lỗi filter điểm:", e);
    }

    setLoading(false);
  }, []);

  // ============================
  // Filter: Activity
  // ============================
  const handleActivityFilter = useCallback(async (filters) => {
    setLoading(true);

    try {
      const res = await filter_activity_dashboard({
        year: filters.year,
        field_id: filters.fieldId,
        org_unit_id: filters.org_unit_id,
        status: filters.status,
      });

      if (res?.data) {
        setActivities(res.data.activities);
        setDashboard({
          totalActivities: res.data.statistics.totalActivities,
        });
        console.log("Filtered activities:", res.data);
      }
    } catch (e) {
      console.error("Lỗi filter activity:", e);
    }

    setLoading(false);
  }, []);

  // ============================
  // Chuẩn hóa dữ liệu để xuất file
  // ============================
  const getExportData = () => {
    if (activeTab === "Score") {
      return students.map((s) => ({
        "Mã sinh viên": s.student.student_number,
        "Họ tên": s.student.full_name,
        Lớp: s.class.name,
        Khoa: s.faculty.name,
        "Năm học": s.year,
        "Điểm số": s.total_point,
      }));
    }

    if (activeTab === "Activity") {
      return activities.map((a) => ({
        "Tên hoạt động": a.title,
        "Ngày tổ chức": formatDateTime(a.start_time),
        "Ngày kết thúc": formatDateTime(a.end_time),
        "Đơn vị tổ chức": a.org_unit_id?.name,
        "Địa chỉ tổ chức": a.location,
        "Trạng thái": a.status,
      }));
    }

    return [];
  };

  // ============================
  // Export Excel
  // ============================
  const handleExportExcel = () => {
    const data = getExportData();
    const sheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `${activeTab}_export.xlsx`);
  };

  // ============================
  // Render table theo từng tab
  // ============================
  const renderScoreTable = () => {
    if (!isFiltered)
      return (
        <p className="no-filter-msg">Vui lòng chọn bộ lọc để lọc sinh viên.</p>
      );

    if (students.length === 0)
      return <p className="no-data-msg">Không tìm thấy sinh viên nào.</p>;

    return (
      <CustomTable
        columns={[
          "Mã sinh viên",
          "Họ tên",
          "Khoa",
          "Lớp",
          "Năm học",
          "Điểm số",
        ]}
        data={students.map((s) => ({
          mã_sinh_viên: s.student.student_number,
          họ_tên: s.student.full_name,
          khoa: s.faculty.name,
          lớp: s.class.name,
          năm_học: s.year,
          điểm_số: s.total_point,
        }))}
      />
    );
  };

  const renderActivityTable = () => {
    if (activities.length === 0)
      return <p className="no-data-msg">Không có hoạt động nào để hiển thị.</p>;

    return (
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
          ngày_tổ_chức: formatDateTime(a.start_time),
          ngày_kết_thúc: formatDateTime(a.end_time),
          đơn_vị_tổ_chức: a.org_unit_id?.name,
          địa_chỉ_tổ_chức: a.location,
          trạng_thái: a.status,
        }))}
      />
    );
  };

  return (
    <div className="statistical-page">
      <Header />
      <Menu_Admin />

      <Filter_Admin
        activeTab={activeTab}
        onFilterApply={
          activeTab === "Score" ? handleScoreFilter : handleActivityFilter
        }
      />

      {/* Dashboard */}
      {activeTab === "Activity" && (
        <div className="info-cards-container">
          <InfoCard
            icon="👥"
            title="Tổng hoạt động"
            value={Dashboard.totalActivities}
          />
        </div>
      )}

      <div className="export-section">
        <button className="export-btn" onClick={handleExportExcel}>
          Xuất file
        </button>
      </div>

      {/* Table */}
      <div className="tabs-content">
        {activeTab === "Score" && (
          <>
            <div className="tab-title">Bảng điểm chi tiết</div>
            <div className="table_1">
              {loading ? (
                <div className="loading-wrapper">
                  <div className="spinner"></div>
                  <div>Đang tải dữ liệu...</div>
                </div>
              ) : (
                renderScoreTable()
              )}
            </div>
          </>
        )}

        {activeTab === "Activity" && (
          <>
            <div className="tab-title">Bảng thông tin hoạt động</div>
            <div className="table_1">
              {loading ? (
                <div className="loading-wrapper">
                  <div className="spinner"></div>
                  <div>Đang tải dữ liệu...</div>
                </div>
              ) : (
                renderActivityTable()
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Statistical_Page;
