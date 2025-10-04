import React from "react";
import "./Filter_activity.css";
import { org } from "../../data/org.js"; 
import { field } from "../../data/field.js";
import { status_activity } from "../../data/status_activity.js";

function FilterBar() {
  return (
    <div className="filter-bar">
      {/* Select tình trạng */}
      <select className="filter-item" defaultValue="">
        <option value="" disabled>Tình trạng</option>
        <option value="all">Tất cả</option>
        {status_activity.map(item => (
          <option key={item.name} value={item.name}>{item.name}</option>
        ))}
      </select>

      {/* Select lĩnh vực */}
      <select className="filter-item" defaultValue="">
        <option value="" disabled>Lĩnh vực</option>
        <option value="all">Tất cả</option>
        {field.map(item => (
          <option key={item.id} value={item.name}>{item.name}</option>
        ))}
      </select>

      {/* Select tổ chức */}
      <select className="filter-item" defaultValue="">
        <option value="" disabled>Tổ chức</option>
        <option value="all">Tất cả</option>
        {org.map(item => (
          <option key={item.id} value={item.name}>{item.name}</option>
        ))}
      </select>

      {/* Ô tìm kiếm */}
      <div className="search-box filter-item">
        <span className="icon">🔍</span>
        <input type="text" placeholder="Tìm kiếm" />
      </div>

      {/* Nút áp dụng và reset */}
      <div className="button-group">
        <button className="apply">Áp dụng bộ lọc</button>
        <button className="reset">Đặt lại</button>
      </div>
    </div>
  );
}

export default FilterBar;
