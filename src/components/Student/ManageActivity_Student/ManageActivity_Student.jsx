import "./ManageActivity_Student.css";
import { useContext } from "react";
import { Evaluate_Activity_Context } from "../Evaluate_Activity/Evaluate_Activity_Context";

function ManageActivity_Student({ name_activity, org, date, location, status, img }) {
  const { openEvaluate } = useContext(Evaluate_Activity_Context);
  return (
    <div className="event-card">
      <img src={img} alt="Event" className="event-image" />

      <div className="event-info">
        <div className="event-header">
          <h3 className="event-title">{name_activity}</h3>
        </div>
        <p className="event-club">{org}</p>
        <p className="event-detail">
          <strong>Thời gian:</strong> {date}
        </p>
        <p className="event-detail">
          <strong>Địa điểm:</strong> {location}
        </p>
      </div>

      <div className="event-status-wrapper">
        {status === "Đã tham gia" ? (
          <>
            <span className="event-status joined">Đã tham gia</span>
            <p className="event-point">Điểm: 5 điểm</p>
          </>
        ) : status === "Đã được duyệt" ? (
          <span className="event-status approved">Đã được duyệt</span>
        ) : (
          <span className="event-status registered">Đã đăng ký</span>
        )}
      </div>

      <div className="event-actions">
        {status === "Đã tham gia" && (
          <button className="event-link" onClick={(e) => {
              e.preventDefault(); // ngăn reload trang
              e.stopPropagation(); //ngăn sự kiện lan sang thẻ <a>
              openEvaluate();     // mở popup đánh giá
            }}
          >
            Đánh giá
          </button>
        )}
        <a href="/activity-details" className="event-link">
          Chi tiết
        </a>
      </div>
    </div>
  );
}

export default ManageActivity_Student;
