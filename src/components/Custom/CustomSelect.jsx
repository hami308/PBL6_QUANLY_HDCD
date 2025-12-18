import React, { useMemo } from "react";
import Select, { components } from "react-select";
import "./CustomSelect.css";

const ALL_OPTION = { value: "all", label: "Tất cả" };

function CustomSelect({
  options = [],
  value = [],
  onChange,
  className,
  readOnly = false,
}) {
  const isAllSelected = value.some((v) => v.value === "all");

  // ===== Lọc option =====
 const filteredOptions = useMemo(() => {
    if (isAllSelected) return [ALL_OPTION];

    const selectedLabels = value.map(v => v.label);

    return [
      ALL_OPTION,
      ...options.filter(
        opt => !selectedLabels.includes(opt.label)
      )
    ];
  }, [options, value, isAllSelected]);


  // ===== Xử lý change =====
  const handleChange = (selected) => {
    if (!selected) {
      onChange([]);
      return;
    }

    // Nếu chọn "Tất cả"
    if (selected.some((s) => s.value === "all")) {
      onChange([ALL_OPTION]);
      return;
    }

    onChange(selected);
  };

  return (
    <div className="tag-select">
      <Select
        isMulti
        options={filteredOptions}
        value={isAllSelected ? [ALL_OPTION] : value}
        onChange={handleChange}
        placeholder="Chọn..."
        className={className}
        classNamePrefix="react-select"
        closeMenuOnSelect={false}
        isDisabled={readOnly}
        menuPortalTarget={document.body}
        components={{
          ClearIndicator: readOnly ? () => null : components.ClearIndicator,
          DropdownIndicator: readOnly ? () => null : components.DropdownIndicator,
          MultiValueRemove: readOnly ? () => null : components.MultiValueRemove,
        }}
      />
    </div>
  );
}

export default CustomSelect;
