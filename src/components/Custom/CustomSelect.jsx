import React from "react";
import Select, { components } from "react-select";

function CustomSelect({ options, value, onChange, className, readOnly = false }) {
  // Hàm xử lý khi thay đổi lựa chọn
  const handleChange = (selectedOptions) => {
    // Nếu chọn "Tất cả"
    if (selectedOptions?.some((opt) => opt.value === "all")) {
      // Nếu đã chọn tất cả rồi → bỏ chọn hết
      if (value.length === options.length) {
        onChange([]);
      } else {
        // Chọn tất cả các option
        onChange(options);
      }
    } else {
      onChange(selectedOptions || []);
    }
  };

  // Tạo thêm option "Tất cả" ở đầu danh sách
  const allOption = { value: "all", label: "Tất cả" };

  return (
    <div className="tag-select" style={{ width: "100%" }}>
      <Select
        isMulti
        options={[allOption, ...options]}
        value={value}
        onChange={handleChange}
        placeholder="Chọn..."
        className={className}
        isDisabled={readOnly}
        menuPortalTarget={document.body}
        components={{
          ClearIndicator: readOnly ? () => null : components.ClearIndicator,
          DropdownIndicator: readOnly ? () => null : components.DropdownIndicator,
          MultiValueRemove: readOnly ? () => null : components.MultiValueRemove,
        }}
        closeMenuOnSelect={false} // để menu không tắt khi chọn
      />
    </div>
  );
}

export default CustomSelect;
