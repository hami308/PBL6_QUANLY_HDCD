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
  // renderKey để buộc re-render khi body.class thay đổi (dark-mode)
  const [renderKey, setRenderKey] = useState(0);

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

  // Gắng đọc trạng thái dark mode hiện tại
  const isDarkMode = typeof document !== "undefined" && document.body.classList.contains("dark-mode");

  // styles dùng trực tiếp cho react-select (bao gồm menuPortal)
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "4.5vh",
      height: "4.5vh",
      borderRadius: "0.3vw",
      fontSize: "2vh",
      backgroundColor: isDarkMode ? "#3e4446" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      borderColor: state.isFocused ? "#2979ff" : isDarkMode ? "#666" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(41, 121, 255, 0.3)" : "none",
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
      backgroundColor: isDarkMode ? "#3e4446" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      borderRadius: "0.5vw",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "200px",
      overflowY: "auto",
      paddingRight: "4px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2979ff"
        : state.isFocused
        ? isDarkMode
          ? "#3e4446"
          : "#3e4446"
        : "transparent",
      color: state.isSelected ? "#fff" : isDarkMode ? "#fff" : "#000",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? "#fff" : "#000",
    }),
    // menuPortal styles: ảnh hưởng wrapper gắn vào document.body
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: isDarkMode ? "#3e4446" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    }),
  };

  // Observe class changes on body (toggle dark-mode) để setRenderKey gây re-render Select
  useEffect(() => {
    if (typeof MutationObserver === "undefined" || typeof document === "undefined") return;
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          // tăng key để re-render Select và áp styles mới
          setRenderKey((k) => k + 1);
          break;
        }
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="filter-bar">
      <Select
        key={`status-${renderKey}`}
        className="filter-item"
        classNamePrefix="react-select"
        placeholder="Tình trạng"
        styles={customSelectStyles}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        options={[
          { value: "all", label: "Tất cả" },
          ...status_activity.map((item) => ({ value: item.name, label: item.name })),
        ]}
      />

      <Select
        key={`field-${renderKey}`}
        className="filter-item"
        classNamePrefix="react-select"
        placeholder="Lĩnh vực"
        styles={customSelectStyles}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        options={[
          { value: "all", label: "Tất cả" },
          ...fields.map((item) => ({ value: item.name, label: item.name })),
        ]}
      />

      <Select
        key={`org-${renderKey}`}
        className="filter-item"
        classNamePrefix="react-select"
        placeholder="Tổ chức/Khoa"
        styles={customSelectStyles}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
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
