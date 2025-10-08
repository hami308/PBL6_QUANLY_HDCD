import React from "react";
import "./InfoCard.css";

const InfoCard = ({ icon, title, value, bgColor = "#ffffff" }) => {
  return (
    <div className="info-card" style={{ backgroundColor: bgColor }}>
      {icon && <div className="info-card-icon">{icon}</div>}
      <div className="info-card-text">
        <p className="info-card-title">{title}</p>
        <p className="info-card-value">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
