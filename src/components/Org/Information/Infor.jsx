import React from "react";
import "./Infor.css";

export default function Infor({
  organization = {
    name: "Câu lạc bộ Công nghệ Trẻ",
    founded: "20/10/2015",
    description:
      "Một tổ chức trẻ trung, năng động, với sứ mệnh lan tỏa đam mê công nghệ đến cộng đồng sinh viên.",
    achievements: [
      "Top 3 Cuộc thi Sáng tạo Trẻ 2020",
      "Tổ chức 50+ workshop trong 3 năm gần nhất",
      "Hợp tác cùng Google Developer Group Việt Nam - 2024",
    ],
    members: [
      {
        name: "Nguyễn Văn A",
        age: 45,
        phone: "0123 456 789",
        email: "nguyenvana@example.com",
        position: "Chủ nhiệm",
        avatar: "https://via.placeholder.com/120",
      },
      {
        name: "Trần Thị B",
        age: 38,
        phone: "0987 654 321",
        email: "tranthib@example.com",
        position: "Phó Chủ nhiệm",
        avatar: "https://via.placeholder.com/120",
      },
      {
        name: "Lê Văn C",
        age: 40,
        phone: "0901 112 233",
        email: "levanc@example.com",
        position: "Thủ quỹ",
        avatar: "https://via.placeholder.com/120",
      },
    ],
  },
}) {
  return (
    <main className="infor-page">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="org-name">{organization.name}</h1>
          <p className="org-founded">Thành lập: {organization.founded}</p>
          <p className="org-description">{organization.description}</p>
        </div>
      </section>

      <section className="achievements">
        <h2 className="section-title">Thành tựu</h2>
        <ul className="achieve-list">
          {organization.achievements.map((a, i) => (
            <li key={i} className="achieve-item">
              <span className="dot" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="members">
        <h2 className="section-title">Ban chủ nhiệm</h2>
        <div className="member-grid">
          {organization.members.map((member, idx) => (
            <article className="member-card" key={idx}>
              <img
                src={member.avatar}
                alt={member.name}
                className="member-avatar"
              />
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>Tuổi: {member.age}</p>
                <p>SĐT: {member.phone}</p>
                <p>Email: {member.email}</p>
                <p>Chức vụ: {member.position}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
