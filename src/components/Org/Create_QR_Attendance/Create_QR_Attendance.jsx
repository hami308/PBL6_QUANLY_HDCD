import React, { useState } from 'react';
import './Create_QR_Attendance.css';
import activity_pic from '../../../assets/images/activity.jpg';
import { generate_qr } from "../../../services/Attendance_Services";

export default function Create_QR_Attendance({ activity }) {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleGenerateQR = async () => {
    if (loading) return;
    setLoading(true);

    const body = {
      activity_id: activity._id,
    };

    const res = await generate_qr(body);

    if (res.success) {
      setQrData(res.data.data);
      setShowPopup(true);
    } else {
      alert("Tạo mã thất bại: " + res.message);
    }

    setLoading(false);
  };

  return (
    <>
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

        {/* Bên phải: QR và text */}
        <div className="create-qr-right" onClick={handleGenerateQR}>
          <span className="material-symbols-outlined">
            qr_code_2
          </span>

          <p className="create-qr-qr-text">
            {loading ? "Đang tạo..." : "Tạo mã"}
          </p>
        </div>
      </div>

      {/* Popup QR */}
      {showPopup && qrData && (
        <div className="qr-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="qr-popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="qr-popup-title">Mã QR Điểm Danh</div>

            <img
              src={qrData.qr_code}
              alt="QR"
              className="qr-popup-image"
            />

            <button className="qr-popup-close" onClick={() => setShowPopup(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
