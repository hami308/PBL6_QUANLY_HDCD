import React from "react";
import "./Filter_activity.css";
import { status_activity } from "../../data/status_activity.js";
import { get_all_fields } from "../../services/Field_Service.js";
import { get_all_faculties } from "../../services/Faculty_Service.js";
import { get_all_org } from "../../services/Org_Service.js";

function FilterBar() {
  const [fields, setFields] = React.useState([]);
  React.useEffect(() => {
    async function fetchFields() {
      const result = await get_all_fields();
      if (result.success) {
        setFields(result.data);
      }
    }
    fetchFields();
  }, []);
  const [organizations, setOrganizations] = React.useState([]);
  React.useEffect(() => {
    async function fetchOrganizations() {
      const [facultiesRes, orgRes] = await Promise.all([
        get_all_faculties(),
        get_all_org(),
      ]);

      if (facultiesRes.success || orgRes.success) {
        const faculties = facultiesRes.success ? facultiesRes.data : [];
        const orgs = orgRes.success ? orgRes.data : [];

        // Gộp 2 mảng lại
        const combined = [
          ...faculties.map((item) => ({ ...item, type: "faculty" })),
          ...orgs.map((item) => ({ ...item, type: "organization" })),
        ];

        setOrganizations(combined);
      }
    }
    fetchOrganizations();
  }, []);
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
        {fields.map(item => (
          <option key={item._id} value={item.name}>{item.name}</option>
        ))}
      </select>

      {/* Select tổ chức */}
      <select className="filter-item" defaultValue="">
        <option value="" disabled>Tổ chức/Khoa</option>
        <option value="all">Tất cả</option>
        {organizations.map(item => (
          <option key={item._id} value={item.name}>{item.name}</option>
        ))}
      </select>

      {/* Ô tìm kiếm */}
      <div className="search-box filter-item">
        <span className="icon"><span className="material-symbols-outlined">search</span></span>
        <input type="text" placeholder="Nhập tên hoạt động" />
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
