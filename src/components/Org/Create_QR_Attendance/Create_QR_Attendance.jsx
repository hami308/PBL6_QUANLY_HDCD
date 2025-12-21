import React, { useState, useEffect } from "react";
import "./Create_QR_Attendance.css";
import activity_pic from "../../../assets/images/activity.jpg";

import { generate_qr } from "../../../services/Attendance_Services";
import { get_students_stats_by_activity } from "../../../services/Activity_Services";

export default function Create_QR_Attendance({ activity }) {
  /* ===================== STATE ===================== */
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);

  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [showAttendancePopup, setShowAttendancePopup] = useState(false);

  const [expireMinutes, setExpireMinutes] = useState(6);
  const [expireTime, setExpireTime] = useState(null);

  const [enableDistance, setEnableDistance] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // ===== Attendance =====
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");

  /* ===================== UTILS ===================== */
  const formatDate = (iso) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ===================== GPS ===================== */
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
          accuracy_m: pos.coords.accuracy,
        });
        setLocationError("");
      },
      () => {
        setLocation(null);
        setLocationError("Bạn cần cấp quyền truy cập vị trí.");
      }
    );
  };

  useEffect(() => {
    if (enableDistance) requestLocation();
    else {
      setLocation(null);
      setLocationError("");
    }
  }, [enableDistance]);

  /* ===================== CREATE QR ===================== */
  const handleGenerateQR = async () => {
    if (enableDistance && !location) {
      alert("Vui lòng cho phép truy cập vị trí.");
      return;
    }

    setLoading(true);

    const body = {
      activity_id: activity._id,
      duration_minutes: Number(expireMinutes),
      location: enableDistance
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy_m,
            geofence_radius_m: Number(maxDistance),
          }
        : null,
    };

    try {
      const res = await generate_qr(body);

      if (res?.success) {
        setQrData(res.data.data);
        setShowQrPopup(true);

        const exp = new Date();
        exp.setMinutes(exp.getMinutes() + Number(expireMinutes));
        setExpireTime(exp);
      } else {
        alert("Tạo QR thất bại");
      }
    } catch (err) {
      console.error("Generate QR error:", err);
      alert("Lỗi khi tạo QR");
    }

    setLoading(false);
    setShowTimePopup(false);
  };

  /* ===================== AUTO EXPIRE ===================== */
  useEffect(() => {
    if (!expireTime || !showQrPopup) return;

    const timer = setInterval(() => {
      if (new Date() >= expireTime) {
        alert("Mã QR đã hết hạn!");
        setShowQrPopup(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expireTime, showQrPopup]);

  /* ===================== LOAD STUDENTS ===================== */
  useEffect(() => {
    if (!showAttendancePopup) return;

    const fetchStudents = async () => {
      setLoadingStudents(true);
      setStudentsError("");

      try {
        const res = await get_students_stats_by_activity(activity._id);

        if (res?.success) {
          setStudents(res.data || []);
        } else {
          setStudentsError("Không tải được danh sách sinh viên.");
        }
      } catch (err) {
        console.error("Fetch students error:", err);
        setStudentsError("Lỗi khi gọi API danh sách sinh viên.");
      }

      setLoadingStudents(false);
    };

    fetchStudents();
  }, [showAttendancePopup, activity._id]);

  /* ===================== JSX ===================== */
  return (
    <>
      {/* ================= CARD ================= */}
      <div className="create-qr-card">
        {/* ICON DANH SÁCH */}
        <span
          className="material-symbols-outlined attendance-icon tooltip-wrapper"
          onClick={(e) => {
            e.stopPropagation();
            setShowAttendancePopup(true);
          }}
        >
          list_alt
          <span className="tooltip-text">Danh sách sinh viên</span>
        </span>

        <div className="create-qr-left">
          <img
            src={activity.activity_image || activity_pic}
            alt={activity.title}
            className="create-qr-image"
          />
          <div>
            <h3 className="create-qr-title">{activity.title}</h3>
            <span className="create-qr-club">
              {activity.org_unit_id?.name}
            </span>
            <p className="create-qr-info">
              Thời gian: {formatDate(activity.start_time)} -{" "}
              {formatDate(activity.end_time)}
            </p>
            <p className="create-qr-info">
              Địa điểm: {activity.location}
            </p>
          </div>
        </div>

        {/* QR BUTTON */}
        <div
          className="create-qr-right"
          onClick={() => !loading && setShowTimePopup(true)}
        >
          <span className="material-symbols-outlined">qr_code_2</span>
          <p className="create-qr-qr-text">
            {loading ? "Đang tạo..." : "Tạo mã"}
          </p>
        </div>
      </div>

      {/* ================= POPUP CONFIG ================= */}
      {showTimePopup && (
        <div className="qr-popup-overlay">
          <div className="qr-popup-container time-popup">
            <div className="qr-popup-title">Cấu hình mã QR</div>

            <label>Số phút hiệu lực</label>
            <input
              type="number"
              min="1"
              value={expireMinutes}
              onChange={(e) => setExpireMinutes(e.target.value)}
              className="qr-time-input"
            />

            <label className="qr-distance-label">
              <input
                type="checkbox"
                checked={enableDistance}
                onChange={(e) => setEnableDistance(e.target.checked)}
              />
              Giới hạn khoảng cách điểm danh
            </label>

            {enableDistance && (
              <div className="qr-distance-config">
                <input
                  type="number"
                  min="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  className="qr-time-input"
                  placeholder="Khoảng cách (m)"
                />

                {location && (
                  <p className="location-ok">
                    ✔ Đã lấy vị trí ({location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)})
                  </p>
                )}

                {locationError && (
                  <p className="location-error">{locationError}</p>
                )}
              </div>
            )}

            <div className="time-popup-buttons">
              <button onClick={handleGenerateQR}>Xác nhận</button>
              <button onClick={() => setShowTimePopup(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= POPUP QR ================= */}
      {showQrPopup && qrData && (
        <div className="qr-popup-overlay">
          <div className="qr-popup-container qr-display-popup">
            <div className="qr-popup-title">Mã QR Điểm Danh</div>
            <img src={qrData.qr_code} alt="QR" className="qr-popup-image" />
            <button onClick={() => setShowQrPopup(false)}>Đóng</button>
          </div>
        </div>
      )}

  {/* ================= POPUP STUDENTS ================= */}
{showAttendancePopup && (
  <div className="qr-popup-overlay">
    <div className="qr-popup-container attendance-popup">
      <div className="qr-popup-title">Danh sách sinh viên</div>

      {/* Loading */}
      {loadingStudents && (
        <p className="attendance-loading">
          Đang tải danh sách sinh viên...
        </p>
      )}

      {/* Error */}
      {!loadingStudents && studentsError && (
        <p className="location-error">{studentsError}</p>
      )}

      {/* Empty */}
      {!loadingStudents &&
        students.length === 0 && (
          <p className="attendance-empty">
            Chưa có sinh viên nào điểm danh hoạt động này.
          </p>
        )}

      {/* List */}
      {!loadingStudents &&
        !studentsError &&
        students.length > 0 && (
          <div className="attendance-list">
            {students.map((st) => (
              <div className="attendance-item" key={st.student_id}>
                <span>
                  {st.student_name}
                  {st.student_code && (
                    <em> ({st.student_code})</em>
                  )}
                </span>
                <span
                  className={`status ${
                    st.status === "present" ? "ok" : "fail"
                  }`}
                >
                  {st.status === "present"
                    ? "✔ Có mặt"
                    : "✖ Vắng"}
                </span>
              </div>
            ))}
          </div>
        )}

      <button onClick={() => setShowAttendancePopup(false)}>
        Đóng
      </button>
    </div>
  </div>
)}


    </>
  );
}
