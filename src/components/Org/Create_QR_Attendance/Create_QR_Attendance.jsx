import React from 'react';
import './Create_QR_Attendance.css';
import activity_pic from '../../../assets/images/activity.jpg';

export default function Create_QR_Attendance({activity}) {
  return (
    <div className="create-qr-card">
      <div className="create-qr-left">
        <img
          src={activity.image || activity_pic}
          alt={activity.name}
          className="create-qr-image"
        />

        <div>
          <h3 className="create-qr-title">{activity.name}</h3>
          <span className="create-qr-club">{activity.org}</span>
          <p className="create-qr-info">Thời gian : {activity.time_org_start} - {activity.time_org_end}</p>
          <p className="create-qr-info">Địa điểm : {activity.location}</p>
        </div>
      </div>

      {/* Bên phải: QR và text */}
      <div className="create-qr-right">
       <span className="material-symbols-outlined">
        qr_code_2
        </span>
        <p className="create-qr-qr-text">Tạo mã</p>
      </div>
    </div>
  );
}
