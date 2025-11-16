import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./Filter_Evidence.css";
import { getClass, getClassesByFaculty } from "../../../services/Class_Service";
import { get_all_faculties } from "../../../services/Faculty_Service";

export default function Filter_Evidence({ total, onClassChange }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isFaculty = user?.roles?.[0]?.role === "staff";

  const [faculties, setFaculties] = useState([]);
  const [classList, setClassList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // ==============================
  // Lấy danh sách khoa
  // ==============================
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const result = await get_all_faculties();

        if (result.success && Array.isArray(result.data)) {
          const facultyOptions = [
            { value: "all", label: "Tất cả khoa" }, // 📌 thêm "Tất cả khoa"
            ...result.data.map((fac) => ({
              value: fac._id,
              label: fac.name,
            })),
          ];
          setFaculties(facultyOptions);
          setSelectedFaculty(facultyOptions[0]); // mặc định "Tất cả khoa"
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách khoa:", error);
      }
    };

    if (isFaculty) fetchFaculties();
  }, [isFaculty]);

  // ==============================
  // Lấy danh sách lớp theo khoa
  // ==============================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        let result;

        if (!selectedFaculty || selectedFaculty.value === "all") {
          result = await getClass(); // tất cả lớp
        } else {
          result = await getClassesByFaculty(selectedFaculty.value); // lớp của khoa
        }

        if (result.success && Array.isArray(result.data)) {
          const classOptions = [
            { value: "all", label: "Tất cả lớp" }, // 📌 thêm "Tất cả lớp"
            ...result.data.map((cls) => ({
              value: cls._id,
              label: cls.name,
            })),
          ];

          setClassList(classOptions);
          setSelectedClass(classOptions[0]); // mặc định chọn "Tất cả lớp"

          if (onClassChange) onClassChange(classOptions[0].value); // gửi "all" lên cha
        }
      } catch (error) {
        console.error("❌ Lỗi khi load lớp:", error);
      }
    };

    if (isFaculty) fetchClasses();
  }, [selectedFaculty, isFaculty, onClassChange]);

  // ==============================
  // Style React Select
  // ==============================
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "white",
      border: "none",
      borderRadius: "4px",
      minHeight: "36px",
      boxShadow: state.isFocused ? "0 0 0 1px #3a7bd5" : "none",
      "&:hover": { border: "none" },
      width: 150,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
      borderRadius: "4px",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "200px",
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "black",
      padding: "8px 12px",
      "&:active": { backgroundColor: "#3a7bd5" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#666",
      fontSize: "14px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333",
      fontSize: "14px",
    }),
  };

  return (
    <div className="filter-evidence-container">
      <div className="total-box">
        <span>📑 Tổng minh chứng</span>
        <strong>{total}</strong>
      </div>

      <h2>Danh sách các minh chứng đã nộp</h2>

      {/* ==============================
          COMBOBOX KHOA + LỚP
      ============================== */}
      {isFaculty && (
        <div className="class-select-container">
          <label>Khoa</label>
          <Select
            options={faculties}
            value={selectedFaculty}
            onChange={setSelectedFaculty}
            placeholder="Chọn khoa"
            classNamePrefix="react-select"
            styles={customStyles}
          />

          <label>Lớp</label>
          <Select
            options={classList}
            value={selectedClass}
            onChange={(option) => {
              setSelectedClass(option);
              if (option && onClassChange) onClassChange(option.value); // gửi classId lên cha
            }}
            placeholder="Chọn lớp"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>
      )}

      {/* ==============================
          Bộ lọc phụ: trạng thái + tìm kiếm + sắp xếp
      ============================== */}
      <div className="filter-evidence-bar">
        <select className="filter-evidence-select">
          <option value="">Tình trạng</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
        </select>

        <div className="search-evidence-box">
          <span className="search-icon material-symbols-outlined">search</span>
          <input type="text" placeholder="Tìm kiếm theo tên" />
        </div>

        <select className="filter-evidence-select">
          <option disabled>Sắp xếp</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="apply-btn">✔ Áp dụng bộ lọc</button>
        <button className="reset-btn">🔄 Đặt lại</button>
      </div>
    </div>
  );
}
