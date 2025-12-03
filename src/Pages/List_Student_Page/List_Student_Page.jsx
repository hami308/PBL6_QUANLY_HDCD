import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import Select from "react-select";
import CancelActivityPopup from "../../components/Popup/CancelActivityPopup.jsx";

import { get_all_faculties } from "../../services/Faculty_Service.js";
import { getClass } from "../../services/Class_Service.js";
import {
  get_registered_students,
  get_students_stats_by_activity,
} from "../../services/Activity_Services.js";
import {
  approve_registration,
  reject_registration,
} from "../../services/Registration_Services.js";
import { update_attendance } from "../../services/Attendance_Services.js";

import "./List_Student_Page.css";

function List_Student_Page({ activeTab: initialActiveTab }) {
  const { idactivity } = useParams();

  /* ------------------ STATE ------------------ */
  const [activeTab, setActiveTab] = useState(initialActiveTab || "student-registered");
  const [faculty, setFaculty] = useState("");
  const [className, setClassName] = useState("");
  const [searchTermMSSV, setSearchTermMSSV] = useState("");
  const [searchTermName, setSearchTermName] = useState("");

  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentsRegistered, setStudentsRegistered] = useState([]);
  const [studentsAttended, setStudentsAttended] = useState([]);

  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    async function fetchInit() {
      try {
        const resFaculty = await get_all_faculties();
        const resClass = await getClass();
        const resRegistered = await get_registered_students(idactivity);
        const resAttended = await get_students_stats_by_activity(idactivity);

        setFaculties(resFaculty.data || []);
        setClasses(resClass.data || []);
        setStudentsRegistered(resRegistered?.data?.data || []);
        setStudentsAttended(resAttended?.data?.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    }
    fetchInit();
  }, [idactivity]);

  /* ------------------ FILTER FUNCTION ------------------ */
  const applyFilters = () => {
    const studentsList = activeTab === "student-registered" ? studentsRegistered : studentsAttended;

    return (studentsList || []).filter((s) => {
      const mssv = s.student_id?.student_number || "";
      const fullname = s.student_id?.full_name || "";

      const facultyMatch = !faculty || s.student_id?.falcuty_id?._id === faculty;
      const classMatch = !className || s.student_id?.class_id?._id === className;
      const mssvMatch = !searchTermMSSV || mssv.includes(searchTermMSSV);
      const nameMatch = !searchTermName || fullname.toLowerCase().includes(searchTermName.toLowerCase());

      return facultyMatch && classMatch && mssvMatch && nameMatch;
    });
  };

  const filteredStudents = applyFilters();

  /* ------------------ HANDLE SCORE CHANGE ------------------ */
  const handleScoreChange = (studentId, value) => {
    setStudentsAttended((prev) =>
      prev.map((s) =>
        s.student_id?._id === studentId
          ? { ...s, total_points: Number(value) || 0 }
          : s
      )
    );
  };

  /* ------------------ ACTIONS ------------------ */
  const handleApprove = async (row) => {
    const id = row.registration_id;
    if (!id) return alert("Không tìm thấy ID đăng ký");

    const res = await approve_registration(id);
    if (res.success) {
      alert("Duyệt thành công!");
      setStudentsRegistered((prev) => prev.filter((x) => x._id !== id));
    } else {
      alert("Lỗi: " + res.message);
    }
  };

  const handleReject = (row) => {
    setSelectedRegistrationId(row.registration_id);
    setIsRejectPopupOpen(true);
  };

  const submitReject = async (reason) => {
    if (!reason.trim()) return alert("Vui lòng nhập lý do");
    const res = await reject_registration(selectedRegistrationId, reason);

    if (res.success) {
      alert("Từ chối thành công!");
      setStudentsRegistered((prev) =>
        prev.filter((x) => x._id !== selectedRegistrationId)
      );
      setIsRejectPopupOpen(false);
    } else {
      alert("Lỗi: " + res.message);
    }
  };

  /* ------------------ SUBMIT SCORES ------------------ */
  const handleSubmitScores = async () => {
    if (!studentsAttended.length) return;

    try {
      const updatePromises = studentsAttended
        .filter((student) => student.attendance_id)
        .map((student) =>
          update_attendance(student.attendance_id, {
            points: Number(student.total_points) || 0,
            status: student.status || "present",
            note: "Điểm danh đã cập nhật",
          })
        );

      const results = await Promise.all(updatePromises);
      const hasError = results.some((res) => !res || !res.success);

      if (hasError) {
        console.error("Lỗi chi tiết khi cập nhật điểm:", results);
        alert("Có lỗi xảy ra khi cập nhật điểm. Kiểm tra console để biết chi tiết.");
      } else {
        alert("Cập nhật điểm thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật điểm:", err);
      alert("Có lỗi xảy ra. Kiểm tra console để biết chi tiết.");
    }
  };

  /* ------------------ EXPORT EXCEL ------------------ */
  const exportToExcel = () => {
    const exportData = filteredStudents.map((s, idx) => ({
      STT: idx + 1,
      MSSV: s.student_id?.student_number,
      "Họ và tên": s.student_id?.full_name,
      Khoa:
        activeTab === "student-attendance"
          ? s.student_id?.class_id?.falcuty_id?.name
          : s.student_id?.falcuty_id?.name,
      Lớp: s.student_id?.class_id?.name,
      Trạng_thái: s.status,
      ...(activeTab === "student-attendance" && { Điểm: s.total_points || 0 }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSach");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

    const fileName =
      activeTab === "student-registered"
        ? "Danh_sach_sinh_vien_dang_ky.xlsx"
        : "Danh_sach_sinh_vien_tham_gia.xlsx";

    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  /* ------------------ TABLE DATA ------------------ */
  const columns =
    activeTab === "student-attendance"
      ? ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái", "Điểm"]
      : ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái"];

  const tableData = filteredStudents.map((s, i) => ({
    id: i,
    registration_id: s._id,
    stt: i + 1,
    mssv: s.student_id?.student_number,
    họ_và_tên: s.student_id?.full_name,
    khoa:
      activeTab === "student-attendance"
        ? s.student_id?.class_id?.falcuty_id?.name
        : s.student_id?.falcuty_id?.name,
    lớp: s.student_id?.class_id?.name,
    trạng_thái: s.status,
    ...(activeTab === "student-attendance" && {
      điểm: (
        <input
          type="number"
          value={s.total_points ?? ""}
          onChange={(e) => handleScoreChange(s.student_id._id, e.target.value)}
          className="score-input"
        />
      ),
    }),
  }));

  const renderActions = (row) => {
    if (row.trạng_thái === "approved" || row.trạng_thái === "rejected") return null;

    return (
      <>
        <button className="approve-btn" onClick={() => handleApprove(row)}>
          Duyệt
        </button>
        <button className="reject-btn" onClick={() => handleReject(row)}>
          Từ chối
        </button>
      </>
    );
  };

  const customStyles = {
    control: (p) => ({
      ...p,
      borderRadius: "8px",
      fontSize: "14px",
      width: "180px",
      height: "40px",
    }),
    menu: (provided) => ({
    ...provided,
    zIndex: 9999, 
  }),
  };

  /* ------------------ RENDER ------------------ */
  return (
    <div className="list-student-page">
      <Header />
      <Menu_org />
      <div className="background-list-student-page"></div>
      <div className="cross-bar">
        <p>
          {activeTab === "student-registered"
            ? "Danh sách sinh viên đăng ký"
            : "Danh sách sinh viên tham gia"}
        </p>
      </div>

      {/* Tabs */}
      <div className="management-tabs">
        <button
          className={activeTab === "student-registered" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("student-registered")}
        >
          Danh sách đăng ký
        </button>
        <button
          className={activeTab === "student-attendance" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("student-attendance")}
        >
          Danh sách tham gia
        </button>
      </div>

      {/* Filters */}
      <div className="filters-list-student-container">
        <input
          type="text"
          placeholder="Mã số sinh viên"
          value={searchTermMSSV}
          onChange={(e) => setSearchTermMSSV(e.target.value)}
          className="filter-list-student-input"
        />
        <input
          type="text"
          placeholder="Tên sinh viên"
          value={searchTermName}
          onChange={(e) => setSearchTermName(e.target.value)}
          className="filter-list-student-input"
        />
        <Select
          options={faculties.map((f) => ({ value: f._id, label: f.name }))}
          value={faculties.map((f) => ({ value: f._id, label: f.name })).find((f) => f.value === faculty)}
          onChange={(opt) => {
            setFaculty(opt ? opt.value : "");
            setClassName("");
          }}
          placeholder="Khoa"
          styles={customStyles}
          isClearable
        />
        <Select
          options={classes.map((c) => ({ value: c._id, label: c.name }))
            .filter((opt) => !faculty || classes.find((c) => c._id === opt.value)?.falcuty_id?._id === faculty)}
          value={classes
            .map((c) => ({ value: c._id, label: c.name }))
            .find((c) => c.value === className)}
          onChange={(opt) => setClassName(opt ? opt.value : "")}
          placeholder="Lớp"
          styles={customStyles}
          isClearable
        />
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-container">
        <button className="export-btn-list-student" onClick={exportToExcel}>
          Xuất Excel
        </button>
        {activeTab === "student-attendance" && filteredStudents.length > 0 && (
          <button className="submit-score-btn" onClick={handleSubmitScores}>
            Xác nhận điểm
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-list-student-container">
        {filteredStudents.length === 0 ? (
          <p className="no-student-msg">
            {activeTab === "student-registered"
              ? "Chưa có sinh viên nào đăng ký"
              : "Chưa có sinh viên nào tham gia"}
          </p>
        ) : (
          <CustomTable
            columns={columns}
            data={tableData}
            renderActions={renderActions}
          />
        )}
      </div>

      {/* Reject Popup */}
      {isRejectPopupOpen && (
        <CancelActivityPopup
          onClose={() => setIsRejectPopupOpen(false)}
          onConfirm={submitReject}
        />
      )}

      <Footer />
    </div>
  );
}

export default List_Student_Page;
