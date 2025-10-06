import activity from "../../../assets/images/activity.jpg";
import "./ManageActivity_Student.css";
function ManageActivity_Student({ status = "Đã được duyệt" }){

    return(
        <div className="event-card">
            <img src={activity} alt="Event" className="event-image" />

            <div className="event-info">
                <div className="event-header">
                    <h3 className="event-title">Hiến máu nhân đạo</h3>
                </div>
                <p className="event-club">Câu lạc bộ Công tác xã hội</p>
                <p className="event-detail">
                <strong>Thời gian:</strong> 15/9/2025
                </p>
                <p className="event-detail">
                <strong>Địa điểm:</strong> Khu B ĐHBK
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
                <a href="/event-rate" className="event-link">Đánh giá</a>
                )}
                <a href="/activity-details" className="event-link">Chi tiết</a>
            </div>
        </div>
    );
}
export default ManageActivity_Student;