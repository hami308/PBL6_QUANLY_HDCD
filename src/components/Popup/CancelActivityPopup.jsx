import React, { useState } from "react";
import "./CancelActivityPopup.css";

const CancelActivityPopup = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do!");
      return;
    }
    
    setIsLoading(true);
    try {
      await onConfirm(reason);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <textarea
          className="popup-textarea"
          placeholder="Nhập lý do"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isLoading}
        />
        <div className="popup-actions">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelActivityPopup;