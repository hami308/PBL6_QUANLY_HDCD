import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_student.jsx";
import "./List_Student_Page.css";
import Footer from "../../components/Footer/Footer.jsx";
import { Faculty } from "../../data/Faculty.js";
import { Class } from "../../data/Class.js";
import CustomTable from "../../components/Custom/CustomTable.jsx";

function List_Student_Page() {
  const [faculty, setFaculty] = useState("");
  const [className, setClassName] = useState("");
  const [activeTab, setActiveTab] = useState("student-registered");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Searching...", { faculty, className, searchTerm });
  };

  const studentList_registered = [
    { id: 1, mssv: "21110001", name: "Nguyễn Văn A", faculty: "CNTT", className: "21CNTT1", status: "Đã tham gia" },
    { id: 2, mssv: "21110002", name: "Trần Thị B", faculty: "XD", className: "21XD1", status: "Chưa tham gia" },
  ];

  const studentList_attended = [
    { id: 1, mssv: "21110001", name: "Nguyễn Văn A", faculty: "CNTT", className: "21CNTT1", status: "Đã tham gia" },
  ];

  const studentList = activeTab === "student-registered" ? studentList_registered : studentList_attended;

  // Khi chọn khoa, chỉ hiển thị lớp thuộc khoa đó
  const filteredClasses = Class.filter(
    (cls) => !faculty || cls.faculty === Number(faculty)
  );

  // Cột của bảng
 // Cột của bảng (ẩn cột “Điểm” nếu không phải tab student-attended)
const columns = activeTab === "student-attended"
  ? ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái", "Điểm"]
  : ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái"];


  const filteredStudents = studentList.filter((student) => {
      return (
        (!faculty || student.faculty === Number(faculty)) &&
        (!className || student.className === className) &&
        (!searchTerm ||
          student.mssv.includes(searchTerm) ||
          student.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  // Dữ liệu hiển thị cho bảng
const tableData = filteredStudents.map((student, index) => {
  const baseData = {
    stt: index + 1,
    mssv: student.mssv,
    họ_và_tên: student.name,
    khoa: Faculty.find((f) => f.id === student.faculty)?.name || "",
    lớp: student.className,
    trạng_thái: student.status,
  };

  // Nếu tab là student-attended thì thêm cột “điểm”
  if (activeTab === "student-attended") {
    baseData.điểm = (
      <input type="number" min="0" max="10" className="score-input" />
    );
  }

  return baseData;
});

  // Render cột “Thao tác”
  const renderActions = () => (
    <button className="action-btn">Chi tiết</button>
  );

  return (
    <div className="list-student-page">
      <Header />
      <Menu_org />
      <div className="background-list-student-page"></div>
      <div className="cross-bar">
        <p>Danh sách sinh viên</p>
      </div>

      {/* Tabs */}
      <div className="management-tabs">
        <button
          className={activeTab === "student-registered" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("student-registered")}
        >
          Danh sách sinh viên đăng ký
        </button>
        <button
          className={activeTab === "student-attended" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("student-attended")}
        >
          Danh sách sinh viên tham gia
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="filters-list-student-container">
        <input
          type="text"
          name="search-mssv"
          placeholder="Mã số sinh viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-list-student-input"
        />
        <input
          type="text"
          name="search-name"
          placeholder="Tên sinh viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-list-student-input"
        />

        {/* Khoa */}
        <select
          value={faculty}
          onChange={(e) => {
            setFaculty(e.target.value);
            setClassName(""); // reset lớp khi đổi khoa
          }}
          className="filter-select"
        >
          <option value="" disabled>Khoa</option>
          {Faculty.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Lớp (lọc theo khoa) */}
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="filter-select"
        >
          <option value="" disabled>Lớp</option>
          {filteredClasses.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} className="search-btn">
          Tìm kiếm
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="table-list-student-container">     
        <CustomTable
          columns={columns}
          data={tableData}
          renderActions={renderActions}
        />
      </div>

      {/* Nút xác nhận */}
      {activeTab === "student-attended" && (
        <div className="action-footer">
          <button className="confirm-btn">Xác nhận điểm</button>
        </div>
      )}
     

      <Footer />
    </div>
  );
}

export default List_Student_Page;
