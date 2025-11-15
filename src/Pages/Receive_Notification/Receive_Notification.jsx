import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_student from "../../components/Menu/Menu_student";
import "./Receive_Notification.css";
import { get_notifications,read_all_notifications } from "../../services/Notifications_Services";

const ICONS = {
  default: "📢",
};

const Receive_Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Hàm định dạng ngày theo chuẩn vi-VN
  const renderDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const studentId = sessionStorage.getItem("student_id");
      const res = await get_notifications(studentId);

      if (res.success && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((n) => ({
          id: n._id,
          title: n.title,
          content: n.content,
          date: n.published_date,
          read: n.isRead,
        }));

        setNotifications(formatted);
        setUnreadCount(res.data.unread_count);

        // Gọi API read-all nhưng không thay đổi state ngay
        if (res.data.unread_count > 0) {
          await read_all_notifications();
          // Không update notifications ngay, trạng thái read sẽ cập nhật khi load lại trang
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);


  return (
    <div className="notification-page">
      <Header />
      <Menu_student />

      <main className="notification-container">
        {/* Header thông báo */}
        <div className="notification-header-section">
          {loading ? (
            <p>Đang tải thông báo...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : unreadCount > 0 ? (
            <p>Bạn có {unreadCount} thông báo chưa đọc</p>
          ) : (
            <p>Tất cả thông báo đã được đọc</p>
          )}
        </div>

        {/* Loading và error state */}
        {loading && <div className="loading">⏳ Đang tải...</div>}
        {error && <div className="error-state">{error}</div>}

        {/* Empty state */}
        {!loading && !error && notifications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Không có thông báo</h3>
            <p>Hiện tại không có thông báo nào dành cho bạn</p>
          </div>
        )}

        {/* Danh sách thông báo */}
        {!loading && !error && notifications.length > 0 && (
          <section className="notification-list-container">
            <div className="notification-list-header">
              <span>Danh sách thông báo</span>
              <span className="notification-count">{notifications.length} thông báo</span>
            </div>

            <div className="notification-list">
              {notifications.map((n, index) => (
                <div
                  key={n.id || `noti-${index}`}
                  className={`notification-item ${!n.read ? "unread" : ""}`}
                >
                  <div className="notification-item-icon">{ICONS.default}</div>
                  <div className="notification-item-content">
                    <h4>{n.title}</h4>
                    <p className="notification-preview">{n.content}</p>
                    <span className="notification-date">{renderDate(n.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Receive_Notification;
