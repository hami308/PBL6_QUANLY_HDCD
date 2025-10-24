import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_student from "../../components/Menu/Menu_student";
import "./Receive_Notification.css";

const ICONS = {
  default: "📢",
};

const Receive_Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "Thông báo lịch học tuần này",
        content:
          "Các lớp học sẽ bắt đầu lúc 7h30 sáng thứ 2. Vui lòng có mặt đúng giờ và chuẩn bị đầy đủ tài liệu học tập.",
        date: "2025-10-23",
        read: false,
      },
      {
        id: 2,
        title: "Cập nhật điểm rèn luyện",
        content:
          "Điểm rèn luyện học kỳ vừa rồi đã được công bố. Sinh viên có thể xem chi tiết trong mục Kết quả học tập.",
        date: "2025-10-22",
        read: true,
      },
      {
        id: 3,
        title: "Thông báo nghỉ học",
        content:
          "Lớp Kiểm thử phần mềm ngày 25/10 tạm hoãn. Lịch học bù sẽ được thông báo sau.",
        date: "2025-10-21",
        read: false,
      },
      {
        id: 4,
        title: "Hướng dẫn đăng ký môn học",
        content:
          "Thời gian đăng ký môn học học kỳ mới bắt đầu từ ngày 01/11. Sinh viên vui lòng hoàn thành trước ngày 15/11.",
        date: "2025-10-20",
        read: true,
      },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="notification-page">
      <Header />
      <Menu_student />

      <main className="notification-container">
        {/* --- Header Section --- */}
        <div className="notification-header-section">
          <p>
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : "Tất cả thông báo đã được đọc"}
          </p>
        </div>

        {/* --- Main Content --- */}
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Không có thông báo</h3>
            <p>Hiện tại không có thông báo nào dành cho bạn</p>
          </div>
        ) : (
          <section className="notification-list-container">
            <div className="notification-list-header">
              <span>Danh sách thông báo</span>
              <span className="notification-count">
                {notifications.length} thông báo
              </span>
            </div>

            <div className="notification-list">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.read ? "unread" : ""}`}
                >
                  <div className="notification-item-icon">{ICONS.default}</div>
                  <div className="notification-item-content">
                    <h4>{n.title}</h4>
                    <p className="notification-preview">{n.content}</p>
                    <span className="notification-date">
                      {renderDate(n.date)}
                    </span>
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
