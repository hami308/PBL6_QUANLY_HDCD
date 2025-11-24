import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./Filter_Evidence.css";

import { getClass, getClassesByFaculty } from "../../../services/Class_Service";
import { get_all_faculties } from "../../../services/Faculty_Service";

export default function Filter_Evidence({ total, onFilterChange }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isFaculty = user?.roles?.[0]?.role === "staff";

  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Hàm gửi filter ra ngoài
  const sendFilter = (faculty, classId) => {
    onFilterChange?.({
      facultyId: faculty || selectedFaculty?.value,
      classId: classId || selectedClass?.value,
      status,
      search,
      sort,
    });
  };

  // ============================
  // Load faculties
  // ============================
  useEffect(() => {
    if (!isFaculty) return;

    const fetchFaculties = async () => {
      const result = await get_all_faculties();

      if (result.success && Array.isArray(result.data)) {
        const options = [
          { value: "all", label: "Tất cả khoa" },
          ...result.data.map((f) => ({
            value: f._id,
            label: f.name,
          })),
        ];
        setFaculties(options);
        setSelectedFaculty(options[0]);
      }
    };

    fetchFaculties();
  }, [isFaculty]);

  // ============================
  // Load classes based on faculty
  // ============================
  useEffect(() => {
    if (!selectedFaculty) return;

    const fetchClasses = async () => {
      let result =
        selectedFaculty.value === "all"
          ? await getClass()
          : await getClassesByFaculty(selectedFaculty.value);

      if (result.success && Array.isArray(result.data)) {
        const options = [
          { value: "all", label: "Tất cả lớp" },
          ...result.data.map((c) => ({
            value: c._id,
            label: c.name,
          })),
        ];

        setClasses(options);
        setSelectedClass(options[0]);
        sendFilter(selectedFaculty.value, options[0].value);
      }
    };

    fetchClasses();
  }, [selectedFaculty]);
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

      {isFaculty && (
        <div className="class-select-container">
          <label>Khoa</label>
          <Select
            options={faculties}
            value={selectedFaculty}
            onChange={(opt) => {
              setSelectedFaculty(opt);
              sendFilter(opt.value, selectedClass?.value);
            }}
            styles={customStyles}
          />

          <label>Lớp</label>
          <Select
            options={classes}
            value={selectedClass}
            onChange={(opt) => {
              setSelectedClass(opt);
              sendFilter(selectedFaculty?.value, opt.value);
            }}
            styles={customStyles}
          />
        </div>
      )}

      {/* FILTER */}
      <div className="filter-evidence-bar">
        {/* Trạng thái */}
        <select
          className="filter-evidence-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tình trạng</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>

        {/* Search */}
        <div className="search-evidence-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <select
          className="filter-evidence-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option disabled value="">
            Sắp xếp
          </option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      <div className="filter-actions">
        <button
          className="apply-btn"
          onClick={() => sendFilter()}
        >
          ✔ Áp dụng bộ lọc
        </button>

        <button
          className="reset-btn"
          onClick={() => {
            setStatus("");
            setSearch("");
            setSort("");
            sendFilter("all", "all");
          }}
        >
          🔄 Đặt lại
        </button>
      </div>
    </div>
  );
}
