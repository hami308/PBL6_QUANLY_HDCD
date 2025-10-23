import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Post_Activity.css";

export default function Post_Activitty({ onClose, activity }) {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleConfirm = () => {
    console.log("Bắt đầu:", startTime, "Kết thúc:", endTime);
    console.log("Ảnh đã chọn:", imageFile);
    onClose(); 
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <h3 className="popup-title">Đăng bài hoạt động</h3>

        <div className="popup-field">
          <label>Tên hoạt động</label>
          <input value={activity.name}  className="post-activity-name-input" readOnly/>
        </div>
        <div className="popup-field">
          <label>Chọn thời gian bắt đầu đăng ký</label>
          <DatePicker
            onChange={setStartTime}
            selected={startTime} 
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn thời gian bắt đầu mở đăng ký"
            className="custom-date-picker-post-activity"
          />
        </div>

        <div className="popup-field">
          <label>Chọn thời gian kết thúc đăng ký</label>
          <DatePicker
            onChange={setEndTime}
            selected={endTime}   
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn thời gian đóng đăng ký"
            className="custom-date-picker-post-activity"
          />
        </div>

       <div className="popup-field">
  <label>Tải ảnh hoạt động</label>
      {!preview ? (
        <div className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                setImageFile(file);
              }
            }}
            className="upload-input"
          />
          <p>Chọn ảnh từ thiết bị của bạn</p>
        </div>
      ) : (
        <div className="image-preview">
          <img src={preview} alt="Ảnh xem trước" />
          <button
            className="remove-image-btn"
            onClick={() => {
              setPreview(null);
              setImageFile(null);
            }}
          >
            Chọn ảnh khác
          </button>
        </div>
      )}
    </div>

        <div className="popup-actions">
          <button className="confirm-btn" onClick={handleConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
