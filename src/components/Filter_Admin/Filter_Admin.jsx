import React, { useState } from "react";
import "./Filter_Admin.css";
import { FaFilter } from "react-icons/fa";

const Filter_Admin = ({ activeTab }) => {
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [className, setClassName] = useState("");

  const [teacherId, setTeacherId] = useState("");
  const [unit, setUnit] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleApply = () => {
    // Xử lý áp dụng bộ lọc ở đây
  };

  const handleReset = () => {
    setStudentId("");
    setFaculty("");
    setClassName("");
    setTeacherId("");
    setUnit("");
    setSortOrder("");
  };

  return (
    <div className="Filter_Admin-container">
      <div className="Filter_Admin-header">
        <FaFilter className="Filter_Admin-icon" />
        <span className="Filter_Admin-title">Bộ lọc</span>
      </div>

      <div className="Filter_Admin-content">
        {/* Nếu đang ở tab Sinh viên */}
        {activeTab === "student" && (
          <>
            <input
              type="text"
              placeholder="Mã số sinh viên"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="filter-input"
            />

            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Khoa</option>
              <option value="CNTT">Công nghệ thông tin</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Ngôn ngữ">Ngôn ngữ</option>
            </select>

            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Lớp</option>
              <option value="KTPM1">KTPM1</option>
              <option value="HTTT2">HTTT2</option>
              <option value="CNPM3">CNPM3</option>
            </select>
          </>
        )}

        {/* Nếu đang ở tab Giảng viên */}
        {activeTab === "teacher" && (
          <>
            <input
              type="text"
              placeholder="Mã giảng viên"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="filter-input"
            />

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Đơn vị</option>
              <option value="CNTT">Khoa CNTT</option>
              <option value="Kinh tế">Khoa Kinh tế</option>
              <option value="Cơ khí">Khoa Cơ khí</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="asc">Từ A → Z</option>
              <option value="desc">Từ Z → A</option>
            </select>
          </>
        )}
      </div>

      <div className="Filter_Admin-buttons">
        <button className="btn-apply" onClick={handleApply}>
          ✓ Áp dụng bộ lọc
        </button>
        <button className="btn-reset" onClick={handleReset}>
          ↻ Đặt lại
        </button>
      </div>
    </div>
  );
};

export default Filter_Admin;
