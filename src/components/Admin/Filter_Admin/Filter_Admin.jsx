import React, { useState } from "react";
import "./Filter_Admin.css";
import { FaFilter } from "react-icons/fa";
import { get_all_faculties } from "../../../services/Faculty_Service";
import { useEffect } from "react";
import getClass from "../../../services/Class_Service";
import { get_all_org } from "../../../services/Org_Service";
const Filter_Admin = ({ activeTab }) => {
  // Student & Teacher filters
  const [studentId, setStudentId] = useState("");
  const [idfaculty, setIdFaculty] = useState("");
  const [className, setClassName] = useState("");

  const [teacherId, setTeacherId] = useState("");
  const [unit, setUnit] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Score tab filters
  const [studentCode, setStudentCode] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  // Activity tab filters
  const [activityYear, setActivityYear] = useState("");
  const [activityField, setActivityField] = useState("");
  const [organization, setOrganization] = useState("");
  const [activityStatus, setActivityStatus] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [orgList, setOrgList] = useState([]);
  useEffect(() => {
    const fetchFaculties = async () => {
      const response = await get_all_faculties();
      console.log("Faculties response:", response);
      if (response.data) {
        setFacultyList(response.data);
      } else {
        console.error("Failed to fetch faculties:", response.message);
        return [];
      }
    };
    fetchFaculties();
  }, []);
  useEffect(() => {
    const fetchClasses = async () => {
      if (idfaculty) {
        const listClasses = await getClass(idfaculty);
        console.log("Classes response:", listClasses);
        if (listClasses.data) {
          setClassName(listClasses.data);
        } else {
          console.error("Failed to fetch classes:", listClasses.message);
        }
      } else {
        setClassName("");
      }
    };
    fetchClasses();
  }, [idfaculty]);

  useEffect(() => {
    const fetchOrg = async () => {
      const response = await get_all_org();
      console.log("Org response:", response);
      if (response.data) {
        setOrgList(response.data);
      } else {
        console.error("Failed to fetch faculties:", response.message);
        return [];
      }
    };
    fetchOrg();
  }, []);

  const handleApply = () => {};

  const handleReset = () => {
    setStudentId("");
    setIdFaculty("");
    setClassName("");
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

  return (
    <div className="Filter_Admin-container">
      <div className="Filter_Admin-header">
        <FaFilter className="Filter_Admin-icon" />
        <span className="Filter_Admin-title">Bộ lọc thống kê</span>
      </div>

      <div className="Filter_Admin-content">
        {/* Student tab */}
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
              <option value="" disabled>
                Khoa
              </option>
              {facultyList.length > 0 ? (
                facultyList.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading...
                </option>
              )}
            </select>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Lớp
              </option>
              {className.length > 0 ? (
                className.map((cls) => (
                  <option key={cls._id} value={cls.name}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Trống
                </option>
              )}
            </select>
          </>
        )}

        {/* Teacher tab */}
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
              <option value="" disabled>
                Đơn vị công tác
              </option>
              {orgList.length > 0 ? (
                orgList.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading
                </option>
              )}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Sắp xếp
              </option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </>
        )}

        {/* Score tab */}
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
              <option value="" disabled>
                Khoa
              </option>
              {facultyList.length > 0 ? (
                facultyList.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading...
                </option>
              )}
            </select>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Lớp
              </option>
              {className.length > 0 ? (
                className.map((cls) => (
                  <option key={cls._id} value={cls.name}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Trống
                </option>
              )}
            </select>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Năm học
              </option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </>
        )}

        {/* Activity tab */}
        {activeTab === "Activity" && (
          <>
            <select
              value={activityYear}
              onChange={(e) => setActivityYear(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Năm học
              </option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>

            <select
              value={activityField}
              onChange={(e) => setActivityField(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Lĩnh vực
              </option>
              <option value="volunteer">Tình nguyện</option>
              <option value="academic">Giáo dục</option>
              <option value="sports">Thể thao</option>
            </select>

            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Chọn đơn vị tổ chức
              </option>

              {orgList.length > 0 ? (
                orgList.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading
                </option>
              )}
            </select>

            <select
              value={activityStatus}
              onChange={(e) => setActivityStatus(e.target.value)}
              className="Filter_Admin-select"
            >
              <option value="" disabled>
                Trạng thái
              </option>
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
