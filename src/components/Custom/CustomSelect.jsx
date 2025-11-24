import React from "react";
import Select, { components } from "react-select";
import "./CustomSelect.css";

function CustomSelect({ options, value, onChange, className, readOnly = false }) {
  const ALL_OPTION = { value: "all", label: "Tất cả" };

  const handleChange = (selected) => {
    if (selected?.some((s) => s.value === "all")) {
      onChange([ALL_OPTION]); // Chỉ giữ lại All
      return;
    }
    onChange(selected || []);
  };

  return (
    <div className="tag-select">
      <Select
        isMulti
        options={[ALL_OPTION, ...options]}
        value={
          value?.some((v) => v.value === "all")
            ? [ALL_OPTION]
            : value
        }
        onChange={handleChange}
        placeholder="Chọn..."
        className={className}
        classNamePrefix="react-select"
        isDisabled={readOnly}
        closeMenuOnSelect={false}
        menuPortalTarget={document.body}
        components={{
          ClearIndicator: readOnly ? () => null : components.ClearIndicator,
          DropdownIndicator: readOnly ? () => null : components.DropdownIndicator,
          MultiValueRemove: readOnly ? () => null : components.MultiValueRemove
        }}
      />
    </div>
  );
}

export default CustomSelect;
