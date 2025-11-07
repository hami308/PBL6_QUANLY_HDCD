import React, { useEffect, useState } from "react";
import "./Filter_Evidence.css";
import { getStudentInfo } from "../../../services/Student/StudentInfor_Services";

export default function Filter_Evidence({total}) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isFaculty = user?.roles?.[0]?.role === "org";
  const [studentClass, setStudentClass] = useState(null);

  // Gọi API lấy thông tin sinh viên
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const result = await getStudentInfo(user.id);
        if (result.class_id) {
          setStudentClass(result.class_id.name || "Không xác định");
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sinh viên:", error);
      }
    };

    if (!isFaculty) {
      fetchStudentInfo();
    }
  }, [isFaculty]);

  return (
    <div className="filter-evidence-container">
      <div className="total-box">
        <span>📑 Tổng minh chứng</span>
        <strong>{total}</strong>
      </div>

      <h2>Danh sách các minh chứng đã nộp</h2>

      {isFaculty ? (
        <div className="class-select-container">
          <label htmlFor="classSelect">Lớp</label>
          <select id="classSelect" className="class-select">
            <option>22T_DT2</option>
            <option>22T_DT1</option>
            <option>21T_DT2</option>
          </select>
        </div>
      ) : (
        studentClass && <p className="class-info">Lớp: {studentClass}</p>
      )}

      <div className="filter-evidence-bar">
        <select className="filter-evidence-select">
          <option>Tình trạng</option>
          <option>Đã duyệt</option>
          <option>Chờ duyệt</option>
        </select>

        <div className="search-evidence-box">
          <span className="search-icon"><span className="material-symbols-outlined">search</span></span>
          <input type="text" placeholder="Tìm kiếm theo tên" />
        </div>

        <select className="filter-evidence-select">
          <option disabled>Sắp xếp</option>
          <option>Mới nhất</option>
          <option>Cũ nhất</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="apply-btn">✔ Áp dụng bộ lọc</button>
        <button className="reset-btn">🔄 Đặt lại</button>
      </div>
    </div>
  );
}
