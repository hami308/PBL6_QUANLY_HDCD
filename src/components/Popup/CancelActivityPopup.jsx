import React, { useState } from "react";
import "./CancelActivityPopup.css";

const CancelActivityPopup = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do hủy hoạt động!");
      return;
    }
    onConfirm(reason); // gửi lý do lên cha
    onClose(); // đóng popup
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <textarea
          className="popup-textarea"
          placeholder="Nhập lý do hủy hoạt động"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="popup-actions">
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelActivityPopup;
