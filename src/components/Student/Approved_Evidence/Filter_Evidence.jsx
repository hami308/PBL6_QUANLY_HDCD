import React, { useEffect, useState } from "react";
import "./Filter_Evidence.css";
import { getStudentInfo } from "../../../services/Student/StudentInfor_Services";
import { getClassesByFaculty } from "../../../services/Class_Service";

export default function Filter_Evidence({ total }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isFaculty = user?.roles?.[0]?.role === "staff";

  const [studentClass, setStudentClass] = useState(null);
  const [classList, setClassList] = useState([]); // danh sách lớp cho faculty

  // Lấy thông tin sinh viên
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

  // Lấy danh sách lớp cho giảng viên
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const result = await getClassesByFaculty(); // giả sử getClass trả về { success: true, data: [...] }
        if (result.success && Array.isArray(result.data)) {
          setClassList(result.data); // result.data là mảng các lớp { id, name }
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách lớp:", error);
      }
    };

    if (isFaculty) {
      fetchClasses();
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
            <option value="">Chọn lớp</option>
            {classList.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        studentClass && <p className="class-info">Lớp: {studentClass}</p>
      )}

      <div className="filter-evidence-bar">
        <select className="filter-evidence-select">
          <option value="">Tình trạng</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
        </select>

        <div className="search-evidence-box">
          <span className="search-icon">
            <span className="material-symbols-outlined">search</span>
          </span>
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
