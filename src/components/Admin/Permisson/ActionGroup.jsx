import React, { useState } from "react";
import "./ActionGroup.css";

const ActionGroup = ({ title, actions = [] }) => {
  // Trạng thái các checkbox
  const [checked, setChecked] = useState({
    all: false,
    ...Object.fromEntries(actions.map((a) => [a, false])),
  });

  // Tick nhóm cha
  const handleParentCheck = () => {
    const newVal = !checked.all;
    const newChecked = Object.fromEntries(actions.map((a) => [a, newVal]));
    setChecked({ all: newVal, ...newChecked });
  };

  // Tick từng action con
  const handleChildCheck = (action) => {
    const newChecked = { ...checked, [action]: !checked[action] };
    const allChecked = actions.every((a) => newChecked[a]);
    setChecked({ ...newChecked, all: allChecked });
  };

  return (
    <div className="action-box">
      <label className="action-group">
        <input
          type="checkbox"
          checked={checked.all}
          onChange={handleParentCheck}
        />
        <span className="group-title">{title}</span>
      </label>

      <div className="action-list">
        {actions.map((action) => (
          <label key={action} className="action_label">
            <input
              type="checkbox"
              checked={checked[action]}
              onChange={() => handleChildCheck(action)}
            />
            {action}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ActionGroup;
