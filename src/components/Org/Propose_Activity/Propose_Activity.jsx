import React from "react";
import "./Propose_Activity.css";

export default function Propose_Activity() {
  const handleSubmit = () => {
    alert("Hoạt động đã được tạo!");
  };

  return (
    <div className="create-activity-container">
      <div className="create-activity-card">
        <h2>Tạo hoạt động</h2>

        {[
          ["Tên hoạt động:", "text"],
          ["Mô tả:", "textarea"],
          ["Thời gian bắt đầu hoạt động:", "text", "9:00 20/10/2025"],
          ["Thời gian kết thúc hoạt động:", "text", "11:00 20/10/2025"],
          ["Địa điểm:", "text", "Hội trường F"],
          ["Đơn vị tổ chức:", "text", "Phòng CTSV"],
          ["Áp dụng với khoa:", "text", "CNTT"],
          ["Áp dụng với khóa:", "text", "K22"],
          ["Số lượng tình nguyện viên:", "number", "20"],
        ].map(([label, type, value], index) => (
          <div className="form-group" key={index}>
            <label>{label}</label>
            {type === "textarea" ? (
              <textarea rows="3" />
            ) : (
              <input type={type} defaultValue={value || ""} />
            )}
          </div>
        ))}

        <div style={{ textAlign: "right" }}>
          <button className="submit-btn" onClick={handleSubmit}>
            ✔
          </button>
        </div>
      </div>
    </div>
  );
}
