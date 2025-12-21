// src/pages/Statistical_Page/Statistical_Page.jsx
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Menu_org from "../../components/Menu/Menu_org";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import InfoCard from "./components/InfoCard/InfoCard";
import CustomTable from "../../components/Custom/CustomTable";
import Footer from "../../components/Footer/Footer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Statistical_Page.css";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import { get_all_activities } from "../../services/Activity_Services";
import { filter_activity_dashboard } from "../../services/StatisticService/Statistic_activity";
import { filter_grades } from "../../services/StatisticService/Statistic_records";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [isFiltered, setIsFiltered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // ⭐ QUAN TRỌNG

  const [Dashboard, setDashboard] = useState({
    totalActivities: 0,
  });

  const [ScoreDashboard, setScoreDashboard] = useState({
    total_students: 0,
    average_points: 0,
    max_points: 0,
  });

  // ============================
  // Load activities khi vào tab Activity
  // ============================
  useEffect(() => {
    if (activeTab !== "Activity") return;

    const fetchActivities = async () => {
      setLoading(true);
      setHasLoaded(false);

      try {
        const res = await get_all_activities();
        if (res.success) {
          setActivities(res.data.data);
          setDashboard({
            totalActivities: res.data.data.length,
          });
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }

      setLoading(false);
      setHasLoaded(true);
    };

    fetchActivities();
  }, [activeTab]);

  // ============================
  // Filter: Score
  // ============================
  const handleScoreFilter = useCallback(async (filters) => {
    setIsFiltered(true);
    setLoading(true);
    setHasLoaded(false);

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
      }
    } catch (e) {
      console.error("Lỗi filter điểm:", e);
    }

    setLoading(false);
    setHasLoaded(true);
  }, []);

  // ============================
  // Filter: Activity
  // ============================
  const handleActivityFilter = useCallback(async (filters) => {
    setLoading(true);
    setHasLoaded(false);

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
      }
    } catch (e) {
      console.error("Lỗi filter activity:", e);
    }

    setLoading(false);
    setHasLoaded(true);
  }, []);

  // ============================
  // Export Excel
  // ============================
  const handleExportExcel = () => {
    const data =
      activeTab === "Score"
        ? students.map((s) => ({
            "Mã sinh viên": s.student.student_number,
            "Họ tên": s.student.full_name,
            Lớp: s.class.name,
            Khoa: s.faculty.name,
            "Năm học": s.year,
            "Điểm số": s.total_point,
          }))
        : activities.map((a) => ({
            "Tên hoạt động": a.title,
            "Ngày tổ chức": formatDateTime(a.start_time),
            "Ngày kết thúc": formatDateTime(a.end_time),
            "Đơn vị tổ chức": a.org_unit_id?.name,
            "Địa chỉ tổ chức": a.location,
            "Trạng thái": a.status,
          }));

    const sheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `${activeTab}_export.xlsx`);
  };

  // ============================
  // Render Score table
  // ============================
  const renderScoreTable = () => {
    if (!isFiltered) {
      return (
        <p className="no-filter-msg">
          Vui lòng chọn bộ lọc để hiển thị dữ liệu.
        </p>
      );
    }

    if (!hasLoaded) return null;

    if (students.length === 0) {
      return <p className="no-data-msg">Không tìm thấy sinh viên nào.</p>;
    }

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

  // ============================
  // Render Activity table
  // ============================
  const renderActivityTable = () => {
    if (!hasLoaded) return null;

    if (activities.length === 0) {
      return <p className="no-data-msg">Không có hoạt động nào.</p>;
    }

    return (
      <CustomTable
        columns={[
          "Tên hoạt động",
          "Ngày tổ chức",
          "Ngày kết thúc",
          "Đơn vị tổ chức",
          "Địa chỉ tổ chức",
          "Trạng thái",
          "Thao tác",
        ]}
        data={activities.map((a) => ({
          tên_hoạt_động: a.title,
          ngày_tổ_chức: formatDateTime(a.start_time),
          ngày_kết_thúc: formatDateTime(a.end_time),
          đơn_vị_tổ_chức: a.org_unit_id?.name,
          địa_chỉ_tổ_chức: a.location,
          trạng_thái: a.status,
          thao_tác: (
            <button
              className="xct"
              onClick={() => navigate(`/activity-details/${a._id}`)}
            >
              Xem chi tiết
            </button>
          ),
        }))}
      />
    );
  };

  const role = sessionStorage.getItem("role");

  return (
    <div className="statistical-page">
      <Header />
      {role === "admin" ? <Menu_Admin /> : <Menu_org />}

      <Filter_Admin
        activeTab={activeTab}
        onFilterApply={
          activeTab === "Score" ? handleScoreFilter : handleActivityFilter
        }
      />

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
        <button
          className="export-btn"
          onClick={handleExportExcel}
          disabled={!hasLoaded}
        >
          Xuất file
        </button>
      </div>

      <div className="tabs-content">
        <div className="table_1">
          {loading ? (
            <div className="loading-wrapper">
              <div className="spinner"></div>
              <div>Đang tải dữ liệu...</div>
            </div>
          ) : activeTab === "Score" ? (
            renderScoreTable()
          ) : (
            renderActivityTable()
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default Statistical_Page;
