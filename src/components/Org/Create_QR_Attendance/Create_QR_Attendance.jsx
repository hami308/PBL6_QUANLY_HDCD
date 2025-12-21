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

  // ====== NEW: khoảng cách & vị trí ======
  const [enableDistance, setEnableDistance] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100); // mét
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // ================================
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

  const openTimePopup = () => {
    if (!loading) setShowTimePopup(true);
  };

  // ====== Xin quyền & lấy GPS ======
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationError("");
      },
      () => {
        setLocation(null);
        setLocationError("Bạn cần cấp quyền truy cập vị trí để dùng tính năng này.");
      }
    );
  };

  // Khi bật giới hạn khoảng cách → xin vị trí
  useEffect(() => {
    if (enableDistance) {
      requestLocation();
    } else {
      setLocation(null);
      setLocationError("");
    }
  }, [enableDistance]);

  // ====== Tạo QR ======
const handleConfirmGenerate = async () => {
  // 👉 Chỉ check GPS khi CÓ bật giới hạn khoảng cách
  if (enableDistance) {
    if (!location) {
      alert("Vui lòng cho phép truy cập vị trí để dùng giới hạn khoảng cách.");
      return;
    }
  }

  setLoading(true);

  const body = {
    activity_id: activity._id,
    duration_minutes: Number(expireMinutes),

    // 👉 Nếu KHÔNG tick → location = null
    location: enableDistance
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy_m,
          geofence_radius_m: Number(maxDistance),
        }
      : null,
  };

  const res = await generate_qr(body);

  if (res.success) {
    setQrData(res.data.data);
    setShowPopup(true);

    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + Number(expireMinutes));
    setExpireTime(expire);
  } else {
    alert("Tạo mã thất bại: " + res.message);
  }

  setLoading(false);
  setShowTimePopup(false);
};


  // ====== Auto hết hạn QR ======
  useEffect(() => {
    if (!expireTime || !showPopup) return;

    const interval = setInterval(() => {
      if (new Date() >= expireTime) {
        alert("Mã QR đã hết hạn!");
        setShowPopup(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTime, showPopup]);

  const handleCloseQr = () => {
    if (expireTime && new Date() >= expireTime) {
      alert("Mã QR đã hết hạn!");
      setShowPopup(false);
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn đóng mã QR không?")) {
      setShowPopup(false);
    }
  };

  return (
    <>
      {/* ===== Card ===== */}
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
              Thời gian: {formatDate(activity.start_time)} - {formatDate(activity.end_time)}
            </p>
            <p className="create-qr-info">Địa điểm: {activity.location}</p>
          </div>
        </div>

        <div className="create-qr-right" onClick={openTimePopup}>
          <span className="material-symbols-outlined">qr_code_2</span>
          <p className="create-qr-qr-text">{loading ? "Đang tạo..." : "Tạo mã"}</p>
        </div>
      </div>

      {/* ===== Popup chọn thời gian + khoảng cách ===== */}
      {showTimePopup && (
        <div className="qr-popup-overlay">
          <div className="qr-popup-container time-popup">
            <div className="qr-popup-title">Cấu hình mã QR</div>

            <label>Số phút hiệu lực:</label>
            <input
              type="number"
              min="1"
              value={expireMinutes}
              onChange={(e) => setExpireMinutes(e.target.value)}
              className="qr-time-input"
            />

            <div className="qr-distance-option">
              <label className="qr-distance-label">
                <input
                  type="checkbox"
                  checked={enableDistance}
                  onChange={(e) => setEnableDistance(e.target.checked)}
                />
                Giới hạn khoảng cách điểm danh
              </label>
            </div>

            {enableDistance && (
              <div className="qr-distance-config">
                <input
                  type="number"
                  min="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  placeholder="Khoảng cách (m)"
                  className="qr-time-input"
                />

                {location && (
                  <p className="location-ok">
                    ✔ Đã lấy vị trí ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                  </p>
                )}

                {locationError && (
                  <p className="location-error">{locationError}</p>
                )}
              </div>
            )}

            <div className="time-popup-buttons">
              <button onClick={handleConfirmGenerate}>Xác nhận</button>
              <button onClick={() => setShowTimePopup(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Popup QR ===== */}
      {showPopup && qrData && (
        <div className="qr-popup-overlay">
          <div className="qr-popup-container qr-display-popup">
            <div className="qr-popup-title">Mã QR Điểm Danh</div>
            <img src={qrData.qr_code} alt="QR" className="qr-popup-image" />
            <button onClick={handleCloseQr}>Đóng</button>
          </div>
        </div>
      )}
    </>
  );
}
