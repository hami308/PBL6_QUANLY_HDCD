// src/pages/Statistical_Page/Statistical_Page.jsx
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import InfoCard from "../../components/Admin/InfoCard/InfoCard";
import CustomTable from "../../components/Custom/CustomTable";
import Footer from "../../components/Footer/Footer";
import "./Statistical_Page.css";
import { getAllRecord } from "../../services/StatisticService/Statistic_records";
import { get_all_activities } from "../../services/Activity_Services";
function Statistical_Page({ activeTab }) {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAllRecord();
        setStudents(data);
        console.log("Data records:", data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await get_all_activities();
        console.log("Fetch activities response:", res);
        if (res.success) {
          setActivities(res.data.data);
        }
        console.log("Data activities:", res);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="statistical-page">
      <Header />
      <Menu_Admin />

      <Filter_Admin activeTab={activeTab} />

      <div className="tabs-content">
        {/* Thẻ thống kê chung */}
        {activeTab === "Score" && (
          <div className="info-cards-container">
            <InfoCard icon="👥" title="Tổng số sinh viên" value="1912" />
            <InfoCard icon="📊" title="Điểm trung bình" value="50" />
            <InfoCard icon="🏆" title="Điểm cao nhất" value="30" />
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="info-cards-container">
            <InfoCard icon="👥" title="Tổng hoạt động " value="1912" />
            <InfoCard icon="📊" title="Số hoạt động năm nay" value="50" />
            <InfoCard icon="🏆" title="Tăng so với năm trước" value="30%" />
          </div>
        )}
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
        {/* Bảng hiển thị */}
        {activeTab === "Score" && (
          <>
            <div className="tab-title">Bảng điểm chi tiết</div>
            <div className="table_1">
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
                  mã_sinh_viên: s.student_id.student_number,
                  họ_tên: s.student_id.full_name,
                  lớp: s.class,
                  khoa: s.faculty,
                  điểm_số: s.total_point,
                  đạt_không_đạt: s.status,
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
