import "./Activity.css";

function Activity({
  id,
  image,
  name,
  volunteers,
  org,
  time_org_start,
  time_org_end,
}) {
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString("vi-VN");
    const timePart = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart} ${timePart}`;
  };

  const time_org = `${formatDateTime(time_org_start)} - ${formatDateTime(
    time_org_end
  )}`;

  return (
    <div className="activity">
      <div className="activity-image">
        <img src={image} alt={name} className="activity-img" />
      </div>

      <div className="activity-header">
        <div className="tooltip">
          <h2 className="activity-title">{name}</h2>
          <span className="tooltip-text">{name}</span>
        </div>
      </div>

      <div className="activity-content">
        <div className="activity-info">
          <span className="activity-label">Số lượng tình nguyện viên:</span>
          <span className="tooltip">
            <span className="activity-value">{volunteers}</span>
            <span className="tooltip-text">{volunteers}</span>
          </span>
        </div>

        <div className="activity-info">
          <span className="activity-label">Đơn vị tổ chức:</span>
          <span className="tooltip">
            <span className="activity-value">{org}</span>
            <span className="tooltip-text">{org}</span>
          </span>
        </div>

        <div className="activity-info">
          <span className="activity-label">Thời gian:</span>
          <span className="tooltip">
            <span className="activity-value">{time_org}</span>
            <span className="tooltip-text">{time_org}</span>
          </span>
        </div>

        <a href={`/activity-details/${id}`} className="activity-details-btn">
          Chi tiết
        </a>
      </div>
    </div>
  );
}

export default Activity;
