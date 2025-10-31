import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./Filter_activity.css";
import { status_activity } from "../../data/status_activity.js";
import { get_all_fields } from "../../services/Field_Service.js";
import { get_all_faculties } from "../../services/Faculty_Service.js";
import { get_all_org } from "../../services/Org_Service.js";

function FilterBar() {
  const [fields, setFields] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    async function fetchFields() {
      const result = await get_all_fields();
      if (result.success) setFields(result.data);
    }
    fetchFields();
  }, []);

  useEffect(() => {
    async function fetchOrganizations() {
      const [facultiesRes, orgRes] = await Promise.all([
        get_all_faculties(),
        get_all_org(),
      ]);
      if (facultiesRes.success || orgRes.success) {
        const faculties = facultiesRes.success ? facultiesRes.data : [];
        const orgs = orgRes.success ? orgRes.data : [];
        const combined = [
          ...faculties.map((item) => ({ ...item, type: "faculty" })),
          ...orgs.map((item) => ({ ...item, type: "organization" })),
        ];
        setOrganizations(combined);
      }
    }
    fetchOrganizations();
  }, []);

  const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "4.5vh",
    height: "4.5vh",
    borderRadius: "0.3vw",
    fontSize: "2vh",
    borderColor: state.isFocused ? "#2979ff" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(41, 121, 255, 0.3)" : "none",
    "&:hover": { borderColor: "#2979ff" },
  }),
  valueContainer: (base) => ({
    ...base,
    height: "4.5vh",
    padding: "0 0.6vw",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "4.5vh",
  }),
  menu: (base) => ({
    ...base,
    maxHeight: "200px",
    overflowY: "auto",
    overflowX: "hidden",
  }),
};

  return (
    <div className="filter-bar">
      <Select
        className="filter-item"
        classNamePrefix="react-select"
        placeholder="Tình trạng"
        styles={customSelectStyles}
        options={[
          { value: "all", label: "Tất cả" },
          ...status_activity.map((item) => ({ value: item.name, label: item.name })),
        ]}
      />

      <Select
        className="filter-item"
        classNamePrefix="react-select"
        placeholder="Lĩnh vực"
        styles={customSelectStyles}
        options={[
          { value: "all", label: "Tất cả" },
          ...fields.map((item) => ({ value: item.name, label: item.name })),
        ]}
      />

      <Select
        className="filter-item"
        classNamePrefix="react-select"
        placeholder="Tổ chức/Khoa"
        styles={customSelectStyles}
        options={[
          { value: "all", label: "Tất cả" },
          ...organizations.map((item) => ({ value: item.name, label: item.name })),
        ]}
      />

      <div className="search-box filter-item">
        <span className="icon"><span className="material-symbols-outlined">search</span></span>
        <input type="text" placeholder="Nhập tên hoạt động" />
      </div>

      <div className="button-group">
        <button className="apply">Áp dụng bộ lọc</button>
        <button className="reset">Đặt lại</button>
      </div>
    </div>
  );
}

export default FilterBar;
