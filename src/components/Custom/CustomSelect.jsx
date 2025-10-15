
import Select, { components } from "react-select";

function CustomSelect({ options, value, onChange, className, readOnly = false }) {
  return (
    <div className="tag-select" style={{ width: "100%" ,flex:"1"}}>
      <Select
        isMulti
        options={options}
        value={value}         // lấy trực tiếp từ cha
        onChange={onChange}   // callback về cha
        placeholder="Chọn..."
        className={className}
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
