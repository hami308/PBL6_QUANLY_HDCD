import React, { useEffect, useState } from "react";
import "./Infor.css";
import { get_org_unit_by_id } from "../../../services/Org_Service";

export default function Infor() {
  const [organization, setOrganization] = useState(null);

  // 👉 format ngày dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ LẤY orgUnitId TỪ sessionStorage
        const orgUnitId = sessionStorage.getItem("orgUnitId");
        console.log("orgUnitId",orgUnitId);
        if (!orgUnitId) return;

        const orgRes = await get_org_unit_by_id(orgUnitId);
        if (orgRes?.success) {
          setOrganization(orgRes.data);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin tổ chức:", error);
      }
    }

    fetchData();
  }, []);

  if (!organization) return <p>Đang tải dữ liệu...</p>;

  return (
    <main className="infor-page">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="org-name">{organization.name}</h1>

          <p className="org-founded">
            Thành lập: {formatDate(organization.founded_date)}
          </p>

          <p className="org-description">{organization.description}</p>
        </div>
      </section>

      <section className="achievements">
        <h2 className="section-title">Thành tựu</h2>
        <ul className="achieve-list">
          {organization.achievements?.map((a, i) => (
            <li key={i} className="achieve-item">
              <span className="dot" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="members">
        <h2 className="section-title">Thành viên</h2>
        <div className="member-grid">
          {organization.staff?.map((member, idx) => (
            <article className="member-card" key={idx}>
              {member.staff_image && (
                <img
                  src={member.staff_image}
                  alt={member.full_name}
                  className="member-avatar"
                />
              )}

              <div className="member-info">
                <h3>{member.full_name}</h3>
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
