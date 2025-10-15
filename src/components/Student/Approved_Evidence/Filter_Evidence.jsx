
import React from "react";
import "./Filter_Evidence.css";

export default function Filter_Evidence() {
  return (
    <div className="filter-evidence-container">
      <div className="total-box">
        <span>📑 Tổng minh chứng</span>
        <strong>40</strong>
      </div>

      <h2>Danh sách các minh chứng đã nộp</h2>
      <p className="class-info">Lớp: 22T_DT2</p>

      <div className="filter-evidence-bar">
        <select className="filter-evidence-select">
          <option>Tình trạng</option>
          <option>Đã duyệt</option>
          <option>Chưa duyệt</option>
        </select>

        <div className="search-evidence-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Tìm kiếm theo tên" />
        </div>

        <select className="filter-evidence-select">
          <option>Sắp xếp</option>
          <option>Tăng dần</option>
          <option>Giảm dần</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="apply-btn">✔ Áp dụng bộ lọc</button>
        <button className="reset-btn">🔄 Đặt lại</button>
      </div>
    </div>
  );
}
