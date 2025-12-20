import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Post_Activity.css";
import { create_post } from "../../../services/Post_Services";

export default function Post_Activity({ onClose, activity }) {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!startTime || !endTime) {
      alert("Vui lòng chọn đầy đủ thời gian!");
      return;
    }

    if (!imageFile) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("activity_id", activity._id);
      formData.append("registration_open", startTime.toISOString());
      formData.append("registration_close", endTime.toISOString());
      formData.append("activity_image", imageFile);

      const res = await create_post(formData);

      if (!res.success) {
        alert(res.message);
        return;
      }

      alert("Đăng bài thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đăng bài!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <h3 className="popup-title">Đăng bài hoạt động</h3>

        {/* Tên hoạt động */}
        <div className="popup-field">
          <label>Tên hoạt động</label>
          <input
            value={activity?.name || activity?.title || ""}
            readOnly
            className="post-activity-name-input"
          />
        </div>

        {/* Thời gian bắt đầu */}
        <div className="popup-field">
          <label>Thời gian bắt đầu đăng ký</label>
          <DatePicker
            selected={startTime}
            onChange={setStartTime}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn thời gian bắt đầu"
            className="custom-date-picker-post-activity"
          />
        </div>

        {/* Thời gian kết thúc */}
        <div className="popup-field">
          <label>Thời gian kết thúc đăng ký</label>
          <DatePicker
            selected={endTime}
            onChange={setEndTime}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn thời gian kết thúc"
            className="custom-date-picker-post-activity"
          />
        </div>

        {/* Upload ảnh */}
        <div className="popup-field">
          <label>Ảnh bài đăng</label>

          {!preview ? (
            <>
              <input
                type="file"
                id="post-activity-image"
                accept="image/*"
                className="upload-input-hidden"
                onChange={handleImageChange}
              />

              <label
                htmlFor="post-activity-image"
                className="upload-box"
              >
                <p>Click để chọn ảnh từ thiết bị</p>
              </label>
            </>
          ) : (
            <div className="image-preview">
              <img src={preview} alt="Ảnh xem trước" />

              <button
                className="remove-image-btn"
                onClick={resetImage}
              >
                Chọn ảnh khác
              </button>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="popup-actions">
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Đang đăng..." : "Xác nhận đăng bài"}
          </button>
        </div>
      </div>
    </div>
  );
}
