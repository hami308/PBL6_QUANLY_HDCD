import React, { useState } from "react";
import "./RoleSelector.css";

const RoleSelector = ({ role }) => {
  const roles = ["Sinh viên", "Cán bộ giảng viên", "Admin"];
  const [selectedRole, setSelectedRole] = useState(role || null);

  const handleCheck = (role) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  return (
    <div className="role-selector">
      <label className="role-label">Chọn vai trò:</label>
      {roles.map((role) => (
        <label key={role} className="role-option">
          <input
            type="checkbox"
            checked={selectedRole === role}
            onChange={() => handleCheck(role)}
          />
          {role}
        </label>
      ))}
    </div>
  );
};

export default RoleSelector;
