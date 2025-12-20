import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import "./Filter_activity.css";

import { get_all_fields } from "../../services/Field_Service.js";
import { get_all_faculties } from "../../services/Faculty_Service.js";
import { get_all_org } from "../../services/Org_Service.js";

function FilterBar({ status = [], onFilter }) {
  const location = useLocation();

  /* ================== ROUTE CHECK ================== */
  const isManageActivityOrg = location.pathname.includes("manage-activity-org");

  /* ================== DATA STATE ================== */
  const [fields, setFields] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [renderKey, setRenderKey] = useState(0);

  /* ================== FILTER STATE ================== */
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchText, setSearchText] = useState("");

  /* ================== FETCH FIELD ================== */
  useEffect(() => {
    async function fetchFields() {
      const result = await get_all_fields();
      if (result.success) setFields(result.data);
    }
    fetchFields();
  }, []);

  /* ================== FETCH ORGANIZATION + FACULTY ================== */
  useEffect(() => {
    async function fetchOrganizations() {
      const [facultiesRes, orgRes] = await Promise.all([
        get_all_faculties(),
        get_all_org(),
      ]);

      const faculties = facultiesRes.success ? facultiesRes.data : [];
      const orgs = orgRes.success ? orgRes.data : [];

      const combined = [
        ...faculties.map((item) => ({ ...item, type: "faculty" })),
        ...orgs.map((item) => ({ ...item, type: "organization" })),
      ];

      setOrganizations(combined);
    }
    fetchOrganizations();
  }, []);

  /* ================== RESET ORG WHEN HIDDEN ================== */
  useEffect(() => {
    if (isManageActivityOrg) {
      setSelectedOrg(null);
    }
  }, [isManageActivityOrg]);

  /* ================== DARK MODE OBSERVER ================== */
  useEffect(() => {
    if (!document || typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          setRenderKey((k) => k + 1);
          break;
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ================== APPLY FILTER ================== */
  const handleApplyFilter = () => {
    const filters = {
      status: selectedStatus?.value !== "all" ? selectedStatus?.value : null,
      field_id: selectedField?.value !== "all" ? selectedField?.value : null,
      org_unit_id:
        !isManageActivityOrg && selectedOrg?.value !== "all"
          ? selectedOrg?.value
          : null,
      title: searchText || null,
    };

    onFilter(filters);
  };

  /* ================== RESET FILTER ================== */
  const handleReset = () => {
    setSelectedStatus(null);
    setSelectedField(null);
    setSelectedOrg(null);
    setSearchText("");
    onFilter({});
  };

  /* ================== DARK MODE ================== */
  const isDarkMode =
    typeof document !== "undefined" &&
    document.body.classList.contains("dark-mode");

  /* ================== SELECT STYLE ================== */
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "4.5vh",
      height: "4.5vh",
      borderRadius: "0.3vw",
      fontSize: "2vh",
      backgroundColor: isDarkMode ? "#3e4446" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      borderColor: state.isFocused
        ? "#2979ff"
        : isDarkMode
        ? "#666"
        : "#ccc",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(41,121,255,0.3)"
        : "none",
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
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2979ff"
        : state.isFocused
        ? "#3e4446"
        : "transparent",
      color: state.isSelected ? "#fff" : isDarkMode ? "#fff" : "#000",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? "#fff" : "#000",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  /* ================== RENDER ================== */
  return (
    <div className="filter-bar">
      {/* STATUS */}
      <Select
        key={`status-${renderKey}`}
        className="filter-item"
        placeholder="Tình trạng"
        styles={customSelectStyles}
        menuPortalTarget={document.body}
        options={[
          { value: "all", label: "Tất cả" },
          ...status.map((item) => ({
            value: item.label,
            label: item.name,
          })),
        ]}
        value={selectedStatus}
        onChange={setSelectedStatus}
      />

      {/* FIELD */}
      <Select
        key={`field-${renderKey}`}
        className="filter-item"
        placeholder="Lĩnh vực"
        styles={customSelectStyles}
        menuPortalTarget={document.body}
        options={[
          { value: "all", label: "Tất cả" },
          ...fields.map((item) => ({
            value: item._id,
            label: item.name,
          })),
        ]}
        value={selectedField}
        onChange={setSelectedField}
      />

      {/* ORGANIZATION (HIDDEN ON manage-activity-org) */}
      {!isManageActivityOrg && (
        <Select
          key={`org-${renderKey}`}
          className="filter-item"
          placeholder="Tổ chức/Khoa"
          styles={customSelectStyles}
          menuPortalTarget={document.body}
          options={[
            { value: "all", label: "Tất cả" },
            ...organizations.map((item) => ({
              value: item._id,
              label: item.name,
            })),
          ]}
          value={selectedOrg}
          onChange={setSelectedOrg}
        />
      )}

      {/* SEARCH */}
      <div className="search-box-activity filter-item">
        <span className="icon">
          <span className="material-symbols-outlined">search</span>
        </span>
        <input
          type="text"
          placeholder="Nhập tên hoạt động"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* BUTTON */}
      <div className="button-group">
        <button className="apply" onClick={handleApplyFilter}>
          Áp dụng bộ lọc
        </button>
        <button className="reset" onClick={handleReset}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
