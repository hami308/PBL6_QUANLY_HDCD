import React, { useState, useEffect } from "react";
import "./Filter_Admin.css";
import { FaFilter } from "react-icons/fa";
import { get_all_faculties } from "../../../services/Faculty_Service";
import { getClass } from "../../../services/Class_Service";
import { get_all_org } from "../../../services/Org_Service";

const Filter_Admin = ({ activeTab, onFilterApply }) => {
  // === STUDENT & TEACHER FILTERS ===
  const [studentId, setStudentId] = useState("");
  const [idfaculty, setIdFaculty] = useState("");

  const [classList, setClassList] = useState([]); //danh sách lớp
  const [selectedClass, setSelectedClass] = useState(""); //lớp được chọn

  const [teacherId, setTeacherId] = useState("");
  const [unit, setUnit] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // === SCORE FILTERS ===
  const [studentCode, setStudentCode] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  // === ACTIVITY FILTERS ===
  const [activityYear, setActivityYear] = useState("");
  const [activityField, setActivityField] = useState("");
  const [organization, setOrganization] = useState("");
  const [activityStatus, setActivityStatus] = useState("");

  // === DATA LISTS ===
  const [facultyList, setFacultyList] = useState([]);
  const [orgList, setOrgList] = useState([]);

  // --- Fetch faculty list ---
  useEffect(() => {
    const fetchFaculties = async () => {
      const response = await get_all_faculties();
      if (response.data) {
        setFacultyList(response.data);
      } else {
        console.error("Failed to fetch faculties:", response.message);
      }
    };
    fetchFaculties();
  }, []);

  // --- Fetch classes theo khoa ---
  useEffect(() => {
    const fetchClasses = async () => {
      if (idfaculty) {
        const res = await getClass(idfaculty);
        if (res.data) {
          setClassList(res.data);
          setSelectedClass(""); // reset lớp khi đổi khoa
        } else {
          console.error("Failed to fetch classes:", res.message);
        }
      } else {
        setClassList([]);
        setSelectedClass("");
      }
    };
    fetchClasses();
  }, [idfaculty]);

  // --- Fetch organizations ---
  useEffect(() => {
    const fetchOrg = async () => {
      const response = await get_all_org();
      if (response.data) {
        setOrgList(response.data);
      } else {
        console.error("Failed to fetch organizations:", response.message);
      }
    };
    fetchOrg();
  }, []);

  // === BUTTON ACTIONS ===
  const handleApply = () => {
    const filters = {
      studentCode,
      idfaculty,
      selectedClass,
      academicYear,
    };

    if (onFilterApply) onFilterApply(filters);
  };

  const handleReset = () => {
    setStudentId("");
    setIdFaculty("");
    setSelectedClass("");
    setClassList([]);
    setTeacherId("");
    setUnit("");
    setSortOrder("");
    setStudentCode("");
    setAcademicYear("");
    setActivityYear("");
    setActivityField("");
    setOrganization("");
    setActivityStatus("");
  };

  // === RENDER ===
  return (
    <div className="Filter_Admin-container">
      <div className="Filter_Admin-header">
        <FaFilter className="Filter_Admin-icon" />
        <span className="Filter_Admin-title">Bộ lọc thống kê</span>
      </div>

      <div className="Filter_Admin-content">
        {/* ===== STUDENT TAB ===== */}
        {activeTab === "student" && (
          <>
            <input
              type="text"
              placeholder="Mã sinh viên"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="filter-input"
            />

            <select
              value={idfaculty}
              onChange={(e) => setIdFaculty(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Khoa</option>
              {facultyList.map((fac) => (
                <option key={fac._id} value={fac._id}>
                  {fac.name}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Lớp</option>
              {classList.length > 0 ? (
                classList.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option disabled>Trống</option>
              )}
            </select>
          </>
        )}

        {/* ===== TEACHER TAB ===== */}
        {activeTab === "teacher" && (
          <>
            <input
              type="text"
              placeholder="Mã cán bộ, giảng viên"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="filter-input"
            />

            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Đơn vị công tác</option>
              {orgList.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Sắp xếp</option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </>
        )}

        {/* ===== SCORE TAB ===== */}
        {activeTab === "Score" && (
          <>
            <input
              type="text"
              placeholder="Mã sinh viên"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="filter-input"
            />

            <select
              value={idfaculty}
              onChange={(e) => setIdFaculty(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Khoa</option>
              {facultyList.map((fac) => (
                <option key={fac._id} value={fac._id}>
                  {fac.name}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Lớp</option>
              {classList.length > 0 ? (
                classList.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option disabled>Trống</option>
              )}
            </select>

            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Năm học</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </>
        )}

        {/* ===== ACTIVITY TAB ===== */}
        {activeTab === "Activity" && (
          <>
            <select
              value={activityYear}
              onChange={(e) => setActivityYear(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Năm học</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>

            <select
              value={activityField}
              onChange={(e) => setActivityField(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Lĩnh vực</option>
              <option value="volunteer">Tình nguyện</option>
              <option value="academic">Giáo dục</option>
              <option value="sports">Thể thao</option>
            </select>

            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Chọn đơn vị tổ chức</option>
              {orgList.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>

            <select
              value={activityStatus}
              onChange={(e) => setActivityStatus(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="">Trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Chưa diễn ra</option>
              <option value="rejected">Bị từ chối</option>
            </select>
          </>
        )}
      </div>

      <div className="Filter_Admin-buttons">
        <button className="btn-apply" onClick={handleApply}>
          ✓ Áp dụng bộ lọc
        </button>
        <button className="btn-reset" onClick={handleReset}>
          ↻ Reset
        </button>
      </div>
    </div>
  );
};

export default Filter_Admin;
