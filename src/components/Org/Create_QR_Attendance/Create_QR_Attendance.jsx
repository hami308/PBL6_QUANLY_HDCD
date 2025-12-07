import React, { useState, useEffect } from 'react';
import './Create_QR_Attendance.css';
import activity_pic from '../../../assets/images/activity.jpg';
import { generate_qr } from "../../../services/Attendance_Services";

export default function Create_QR_Attendance({ activity }) {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [expireMinutes, setExpireMinutes] = useState(6);
  const [expireTime, setExpireTime] = useState(null);

  // Format thời gian hiển thị
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mở popup chọn thời gian
  const openTimePopup = () => {
    if (loading) return;
    setShowTimePopup(true);
  };

  // Xác nhận tạo QR
  const handleConfirmGenerate = async () => {
    setLoading(true);

    const body = {
      activity_id: activity._id,
      duration_minutes: Number(expireMinutes)
    };

    const res = await generate_qr(body);

    if (res.success) {
      setQrData(res.data.data);
      setShowPopup(true);

      // Lưu thời gian hết hạn dựa trên số phút nhập vào
      const expire = new Date();
      expire.setMinutes(expire.getMinutes() + Number(expireMinutes));
      setExpireTime(expire);
    } else {
      alert("Tạo mã thất bại: " + res.message);
    }

    setLoading(false);
    setShowTimePopup(false);
  };

  // Tự động kiểm tra QR hết hạn
  useEffect(() => {
    if (!expireTime || !showPopup) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= expireTime) {
        alert("Mã QR đã hết hạn!");
        setShowPopup(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTime, showPopup]);

  // Đóng QR popup với xác nhận hoặc cảnh báo
  const handleCloseQr = () => {
    const now = new Date();
    if (expireTime && now >= expireTime) {
      alert("Mã QR đã hết hạn!");
      setShowPopup(false);
      return;
    }

    const confirmClose = window.confirm("Bạn có chắc chắn muốn đóng mã QR không?");
    if (confirmClose) {
      setShowPopup(false);
    }
  };

  return (
    <>
      {/* Card hiển thị hoạt động */}
      <div className="create-qr-card">
        <div className="create-qr-left">
          <img
            src={activity.activity_image || activity_pic}
            alt={activity.title}
            className="create-qr-image"
          />
          <div>
            <h3 className="create-qr-title">{activity.title}</h3>
            <span className="create-qr-club">{activity.org_unit_id.name}</span>
            <p className="create-qr-info">
              Thời gian : {formatDate(activity.start_time)} - {formatDate(activity.end_time)}
            </p>
            <p className="create-qr-info">Địa điểm : {activity.location}</p>
          </div>
        </div>

        <div className="create-qr-right" onClick={openTimePopup}>
          <span className="material-symbols-outlined">qr_code_2</span>
          <p className="create-qr-qr-text">{loading ? "Đang tạo..." : "Tạo mã"}</p>
        </div>
      </div>

      {/* Popup chọn thời gian */}
      {showTimePopup && (
        <div className="qr-popup-overlay">
          <div className="qr-popup-container time-popup">
            <div className="qr-popup-title">Chọn thời gian hiệu lực</div>
            <p className="time-popup-label">Số phút mã QR có hiệu lực:</p>
            <input
              type="number"
              min="1"
              value={expireMinutes}
              onChange={(e) => setExpireMinutes(e.target.value)}
              className="qr-time-input"
            />
            <div className="time-popup-buttons">
              <button className="time-popup-confirm" onClick={handleConfirmGenerate}>
                Xác nhận
              </button>
              <button className="time-popup-cancel" onClick={() => setShowTimePopup(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup QR */}
      {showPopup && qrData && (
        <div className="qr-popup-overlay">
          <div className="qr-popup-container qr-display-popup">
            <div className="qr-popup-title">Mã QR Điểm Danh</div>
            <img src={qrData.qr_code} alt="QR" className="qr-popup-image" />
            <button className="qr-popup-close" onClick={handleCloseQr}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
