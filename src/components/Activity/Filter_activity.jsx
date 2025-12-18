import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./Filter_activity.css";
import { get_all_fields } from "../../services/Field_Service.js";
import { get_all_faculties } from "../../services/Faculty_Service.js";
import { get_all_org } from "../../services/Org_Service.js";

function FilterBar({ status = [], onFilter }) { // Thêm prop onFilter
  const [fields, setFields] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [renderKey, setRenderKey] = useState(0);
  
  // State cho các bộ lọc
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchText, setSearchText] = useState("");

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
 // Observe class changes on body (toggle dark-mode) để setRenderKey gây re-render Select
  useEffect(() => {
    if (typeof MutationObserver === "undefined" || typeof document === "undefined") return;
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          // tăng key để re-render Select và áp dụng styles mới
          setRenderKey((k) => k + 1);
          break;
        }
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  // Hàm xử lý khi nhấn nút Áp dụng bộ lọc
  const handleApplyFilter = () => {
    const filters = {
      status: selectedStatus?.value !== "all" ? selectedStatus?.value : null,
      field_id: selectedField?.value !== "all" ? selectedField?.value : null,
      org_unit_id: selectedOrg?.value !== "all" ? selectedOrg?.value : null,
      title: searchText || null,
    };
    
    // Gọi hàm onFilter từ props và truyền filters
    onFilter(filters);
  };

  // Hàm xử lý khi nhấn nút Đặt lại
  const handleReset = () => {
    setSelectedStatus(null);
    setSelectedField(null);
    setSelectedOrg(null);
    setSearchText("");
    // Gọi onFilter với filters rỗng để lấy tất cả hoạt động
    onFilter({});
  };

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
          ...status.map((item) => ({ value: item.label, label: item.name })),
        ]}
        value={selectedStatus}
        onChange={setSelectedStatus}
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
          ...fields.map((item) => ({ value: item._id, label: item.name })),
        ]}
        value={selectedField}
        onChange={setSelectedField}
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
          ...organizations.map((item) => ({ value: item._id, label: item.name })),
        ]}
        value={selectedOrg}
        onChange={setSelectedOrg}
      />

      <div className="search-box-activity filter-item">
        <span className="icon"><span className="material-symbols-outlined">search</span></span>
        <input 
          type="text" 
          placeholder="Nhập tên hoạt động" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="button-group">
        <button className="apply" onClick={handleApplyFilter}>Áp dụng bộ lọc</button>
        <button className="reset" onClick={handleReset}>Đặt lại</button>
      </div>
    </div>
  );
}

export default FilterBar;