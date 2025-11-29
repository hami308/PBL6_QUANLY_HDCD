import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import "./List_Student_Page.css";
import Footer from "../../components/Footer/Footer.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import Select from "react-select";
import { useParams } from "react-router-dom";

import { get_all_faculties } from "../../services/Faculty_Service.js";
import { getClass } from "../../services/Class_Service.js";
import {
  get_registered_students,
  get_students_stats_by_activity,
} from "../../services/Activity_Services.js";

function List_Student_Page() {
  const { idactivity } = useParams();

  // Tabs
  const [activeTab, setActiveTab] = useState("registered");

  // Filters
  const [faculty, setFaculty] = useState("");
  const [className, setClassName] = useState("");
  const [searchTermMSSV, setSearchTermMSSV] = useState("");
  const [searchTermName, setSearchTermName] = useState("");

  // API data
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentsRegistered, setStudentsRegistered] = useState([]);
  const [studentsAttended, setStudentsAttended] = useState([]);

  // Load dữ liệu
  useEffect(() => {
    async function fetchInit() {
      try {
        const resFaculty = await get_all_faculties();
        const resClass = await getClass();
        const resRegistered = await get_registered_students(idactivity);
        const resAttended = await get_students_stats_by_activity(idactivity);

        setFaculties(resFaculty.data || []);
        setClasses(resClass.data || []);

        // Danh sách đăng ký
        setStudentsRegistered(
          Array.isArray(resRegistered?.data?.data)
            ? resRegistered.data.data
            : []
        );

        // Danh sách tham gia
        setStudentsAttended(
          Array.isArray(resAttended?.data?.data)
            ? resAttended.data.data
            : []
        );
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    }

    fetchInit();
  }, [idactivity]);

  // Chọn danh sách theo tab
  const students =
    activeTab === "registered" ? studentsRegistered : studentsAttended;

  // Select options
  const facultyOptions = faculties.map((f) => ({
    value: f._id,
    label: f.name,
  }));

  const classOptions = classes.map((cls) => ({
    value: cls._id,
    label: cls.name,
  }));

  // Lọc lớp theo khoa
  const filteredClassOptions = classOptions.filter(
    (option) =>
      !faculty ||
      classes.find((c) => c._id === option.value)?.falcuty_id?._id === faculty
  );

  // Hàm cập nhật điểm
const handleScoreChange = (studentId, value) => {
  setStudentsAttended((prev) =>
    prev.map((s) =>
      s.student_id?._id === studentId
        ? { ...s, total_points: value }
        : s
    )
  );
};


  // Lọc sinh viên
  const filteredStudents = (Array.isArray(students) ? students : []).filter(
    (s) => {
      const mssv = s.student_id?.student_number || "";
      const fullName = s.student_id?.full_name || "";

      return (
        (!faculty || s.faculty_id === faculty) &&
        (!className || s.class_id === className) &&
        (!searchTermMSSV || mssv.includes(searchTermMSSV)) &&
        (!searchTermName ||
          fullName.toLowerCase().includes(searchTermName.toLowerCase()))
      );
    }
  );

  // Cột bảng
  const columns =
    activeTab === "attended"
      ? ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái", "Điểm"]
      : ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái"];

  // Dữ liệu bảng
  const tableData = filteredStudents.map((s, index) => ({
    id:  index,
    stt: index + 1,
    mssv: s.student_id?.student_number,
    họ_và_tên: s.student_id?.full_name,
    khoa: s.student_id?.falcuty_id?.name,
    lớp: s.student_id?.class_id?.name,
    trạng_thái: s.status,

    ...(activeTab === "attended" && {
      điểm: (
        <input
          type="number"
          value={s.total_points ?? ""}
          onChange={(e) => handleScoreChange(s.student_id._id, e.target.value)}
          className="score-input"
          style={{
            width: "80px",
            padding: "4px 6px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      ),
    }),
  }));

  const renderActions = () => (
    <button className="action-btn">Chi tiết</button>
  );

  // Style React Select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      padding: "4px 8px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "14px",
      width: "180px",
      height: "40px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  return (
    <div className="list-student-page">
      <Header />
      <Menu_org />
      <div className="background-list-student-page"></div>

      <div className="cross-bar">
        <p>
          {activeTab === "registered"
            ? "Danh sách sinh viên đăng ký"
            : "Danh sách sinh viên tham gia"}
        </p>
      </div>

      {/* Tabs */}
      <div className="management-tabs">
        <button
          className={activeTab === "registered" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("registered")}
        >
          Danh sách đăng ký
        </button>

        <button
          className={activeTab === "attended" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("attended")}
        >
          Danh sách tham gia
        </button>
      </div>

      {/* Bộ lọc */}
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
          options={facultyOptions}
          value={facultyOptions.find((opt) => opt.value === faculty)}
          onChange={(selected) => {
            setFaculty(selected ? selected.value : "");
            setClassName("");
          }}
          placeholder="Khoa"
          isClearable
          styles={customStyles}
        />

        <Select
          options={filteredClassOptions}
          value={filteredClassOptions.find((opt) => opt.value === className)}
          onChange={(selected) => setClassName(selected ? selected.value : "")}
          placeholder="Lớp"
          isClearable
          styles={customStyles}
        />
      </div>

      {/* Bảng */}
      <div className="table-list-student-container">
        {filteredStudents.length === 0 ? (
          <p className="no-student-msg">
            {activeTab === "registered"
              ? "Chưa có sinh viên nào đăng ký hoạt động"
              : "Chưa có sinh viên nào tham gia hoạt động"}
          </p>
        ) : (
          <CustomTable
            columns={columns}
            data={tableData}
            renderActions={renderActions}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default List_Student_Page;
