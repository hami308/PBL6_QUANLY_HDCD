import "./Activity.css";
import dayjs from "dayjs";

function Activity({id, image, name, volunteers, org, time_org_start, time_org_end }) {
  const formatDateTime = (datetime) => {
  // Tách giờ và ngày
  const [time, date] = datetime.split(" ");
  // Định dạng lại ngày
  const formattedDate = dayjs(date).format("DD/MM/YYYY");
  return `${time} ${formattedDate}`;
};
  return (
   <div className="activity">
      <div className="activity-image">
        <img src={image} alt={name} className="activity-img" />
      </div>
      <div className="activity-header">
        <h2 className="activity-title">{name}</h2>
      </div>
      <div className="activity-content">
        <div className="activity-info">
          <span className="activity-label">Số lượng tình nguyện viên :</span>
          <span className="activity-value">{volunteers}</span>
        </div>
        <div className="activity-info">
          <span className="activity-label">Đơn vị tổ chức :</span>
          <span className="activity-value">{org}</span>
        </div>
        <div className="activity-info">
          <span className="activity-label">Thời gian :</span>
          <span className="activity-value">{formatDateTime(time_org_start)} - {formatDateTime(time_org_end)}</span>
        </div>
        <a href={`/activity-details/${id}`} className="activity-details-btn">Chi tiết</a>
      </div>
    </div>
  )
}

export default Activity;