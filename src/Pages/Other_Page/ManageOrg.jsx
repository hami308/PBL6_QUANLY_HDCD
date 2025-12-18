import { useEffect, useState } from "react";
import "./ManageOrganization.css";

import {
  get_all_org,
  create_org_unit,
  update_org_unit,
} from "../../services/Org_Service";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

const ManageOrganization = () => {
  const [orgUnits, setOrgUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editOrg, setEditOrg] = useState(null);

  // ===== FORM =====
  const [form, setForm] = useState({
    name: "",
    founded_date: "",
    description: "",
    achievements: [],
    achievementInput: "",
  });

  // =========================
  // Utils
  // =========================
  const formatDateVN = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const toInputDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // =========================
  // Load danh sách tổ chức
  // =========================
  const loadOrgUnits = async () => {
    setLoading(true);
    const res = await get_all_org();
    if (res.success) {
      setOrgUnits(res.data || []);
    } else {
      alert(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrgUnits();
  }, []);

  // =========================
  // Modal - Tạo mới
  // =========================
  const openCreateModal = () => {
    setEditOrg(null);
    setForm({
      name: "",
      founded_date: "",
      description: "",
      achievements: [],
      achievementInput: "",
    });
    setShowModal(true);
  };

  // =========================
  // Modal - Sửa
  // =========================
  const openEditModal = (org) => {
    setEditOrg(org);
    setForm({
      name: org.name || "",
      founded_date: toInputDate(org.founded_date),
      description: org.description || "",
      achievements: org.achievements || [],
      achievementInput: "",
    });
    setShowModal(true);
  };

  // =========================
  // Build payload
  // =========================
  const buildPayload = () => ({
    name: form.name,
    founded_date: form.founded_date || undefined,
    description: form.description || undefined,
    achievements: form.achievements.length ? form.achievements : undefined,
  });

  // =========================
  // Create
  // =========================
  const handleCreateOrg = async () => {
    const res = await create_org_unit(buildPayload());
    if (!res.success) return alert(res.message);

    alert("Tạo tổ chức thành công");
    setShowModal(false);
    loadOrgUnits();
  };

  // =========================
  // Update
  // =========================
  const handleUpdateOrg = async () => {
    const res = await update_org_unit(editOrg._id, buildPayload());
    if (!res.success) return alert(res.message);

    alert("Cập nhật tổ chức thành công");
    setShowModal(false);
    loadOrgUnits();
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="org-container">
        <h2>Quản lý đơn vị tổ chức</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm tổ chức
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="org-table">
            <thead>
              <tr>
                <th>Tên đơn vị</th>
                <th>Ngày thành lập</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orgUnits.map((org) => (
                <tr key={org._id}>
                  <td>{org.name}</td>
                  <td>{formatDateVN(org.founded_date)}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(org)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editOrg ? "Cập nhật tổ chức" : "Thêm đơn vị tổ chức"}</h3>

            <input
              placeholder="Tên đơn vị"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="date"
              value={form.founded_date}
              onChange={(e) =>
                setForm({ ...form, founded_date: e.target.value })
              }
            />

            <textarea
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* ACHIEVEMENTS */}
            <input
              placeholder="Nhập thành tựu và nhấn Enter"
              value={form.achievementInput}
              onChange={(e) =>
                setForm({ ...form, achievementInput: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && form.achievementInput.trim()) {
                  e.preventDefault();
                  setForm({
                    ...form,
                    achievements: [
                      ...form.achievements,
                      form.achievementInput.trim(),
                    ],
                    achievementInput: "",
                  });
                }
              }}
            />

            <ul className="achievement-list">
              {form.achievements.map((item, index) => (
                <li key={index} className="achievement-item">
                  {item}
                  <button
                    className="btn-remove"
                    onClick={() =>
                      setForm({
                        ...form,
                        achievements: form.achievements.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={editOrg ? handleUpdateOrg : handleCreateOrg}
              >
                Lưu
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageOrganization;
