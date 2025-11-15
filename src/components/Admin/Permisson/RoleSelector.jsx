import React, { useState } from "react";
import "./RoleSelector.css";

const RoleSelector = ({ role }) => {
  const roles = {
    student: "Sinh viên",
    staff: "Tổ chức",
    admin: "Admin",
  };
  const [selectedRole, setSelectedRole] = useState(role || null);

  const handleCheck = (role) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  return (
    <div className="role-selector">
      <label className="role-label">Chọn vai trò:</label>
      {Object.entries(roles).map(([key, value]) => (
        <label key={key} className="role-option">
          <input
            type="checkbox"
            checked={selectedRole === key}
            onChange={() => handleCheck(key)}
          />
          {value}
        </label>
      ))}
    </div>
  );
};

export default RoleSelector;
