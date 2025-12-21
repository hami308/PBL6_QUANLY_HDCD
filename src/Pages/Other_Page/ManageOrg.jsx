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

  const [form, setForm] = useState({
    name: "",
    founded_date: "",
    description: "",
    achievements: [],
    achievementInput: "",
  });

  useEffect(() => {
    loadOrgUnits();
  }, []);

  const loadOrgUnits = async () => {
    setLoading(true);
    const res = await get_all_org();
    if (res.success) setOrgUnits(res.data || []);
    else alert(res.message);
    setLoading(false);
  };

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

  const openEditModal = (org) => {
    setEditOrg(org);
    setForm({
      name: org.name || "",
      founded_date: org.founded_date
        ? new Date(org.founded_date).toISOString().split("T")[0]
        : "",
      description: org.description || "",
      achievements: org.achievements || [],
      achievementInput: "",
    });
    setShowModal(true);
  };

  const buildPayload = () => ({
    name: form.name,
    founded_date: form.founded_date || undefined,
    description: form.description || undefined,
    achievements: form.achievements.length ? form.achievements : undefined,
  });

  const handleCreateOrg = async () => {
    const res = await create_org_unit(buildPayload());
    if (!res.success) return alert(res.message);
    alert("Tạo tổ chức thành công");
    setShowModal(false);
    loadOrgUnits();
  };

  const handleUpdateOrg = async () => {
    const res = await update_org_unit(editOrg._id, buildPayload());
    if (!res.success) return alert(res.message);
    alert("Cập nhật tổ chức thành công");
    setShowModal(false);
    loadOrgUnits();
  };

  return (
    <div className="manage-org">
      <Header />
      <Menu_Admin />

      <div className="manage-org__container">
        <div className="manage-org__header">
          <h2 className="manage-org__title">Quản lý đơn vị tổ chức</h2>
          <p className="manage-org__subtitle">
            Quản lý và cập nhật thông tin các đơn vị trong tổ chức
          </p>
        </div>

        <div className="manage-org__toolbar">
          <button className="manage-org__add-btn" onClick={openCreateModal}>
            <span className="manage-org__add-icon">+</span>
            Thêm tổ chức mới
          </button>
        </div>

        {loading ? (
          <div className="manage-org__loading-container">
            <div className="manage-org__loading-spinner"></div>
            <p className="manage-org__loading-text">Đang tải dữ liệu...</p>
          </div>
        ) : orgUnits.length === 0 ? (
          <div className="manage-org__empty">
            <div className="manage-org__empty-icon">🏢</div>
            <h3 className="manage-org__empty-title">Chưa có đơn vị tổ chức</h3>
            <p className="manage-org__empty-description">
              Bắt đầu bằng cách thêm đơn vị tổ chức đầu tiên
            </p>
            <button className="manage-org__empty-btn" onClick={openCreateModal}>
              Thêm đơn vị đầu tiên
            </button>
          </div>
        ) : (
          <div className="manage-org__table-wrapper">
            <table className="manage-org__table">
              <thead className="manage-org__thead">
                <tr>
                  <th className="manage-org__th">Tên đơn vị</th>
                  <th className="manage-org__th">Ngày thành lập</th>
                  <th className="manage-org__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="manage-org__tbody">
                {orgUnits.map((org) => (
                  <tr key={org._id} className="manage-org__row">
                    <td className="manage-org__td manage-org__td--name">
                      <div className="manage-org__org-info">
                        <div className="manage-org__org-name">{org.name}</div>
                        {org.description && (
                          <div className="manage-org__org-desc">
                            {org.description.length > 50
                              ? `${org.description.substring(0, 50)}...`
                              : org.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="manage-org__td">
                      <div className="manage-org__date">
                        {org.founded_date ? (
                          new Date(org.founded_date).toLocaleDateString("vi-VN")
                        ) : (
                          <span className="manage-org__no-date">
                            Chưa cập nhật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="manage-org__td">
                      <div className="manage-org__actions">
                        <button
                          className="manage-org__edit-btn"
                          onClick={() => openEditModal(org)}
                          title="Chỉnh sửa"
                        >
                          <span className="manage-org__edit-icon">✏️</span>
                          Sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="org-modal">
          <div
            className="org-modal__overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="org-modal__content">
            <div className="org-modal__header">
              <div className="org-modal__header-content">
                <div className="org-modal__icon">{editOrg ? "✏️" : "➕"}</div>
                <div>
                  <h3 className="org-modal__title">
                    {editOrg ? "Cập nhật tổ chức" : "Thêm đơn vị tổ chức"}
                  </h3>
                  <p className="org-modal__subtitle">
                    {editOrg
                      ? "Cập nhật thông tin chi tiết của tổ chức"
                      : "Nhập thông tin chi tiết của đơn vị tổ chức mới"}
                  </p>
                </div>
              </div>
              <button
                className="org-modal__close"
                onClick={() => setShowModal(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="org-modal__body">
              <div className="org-form">
                <div className="org-form__group">
                  <label className="org-form__label">
                    Tên đơn vị
                    <span className="org-form__required">*</span>
                  </label>
                  <input
                    className="org-form__input"
                    placeholder="Ví dụ: Phòng Công nghệ thông tin"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <div className="org-form__char-count">
                    {form.name.length}/100
                  </div>
                </div>

                <div className="org-form__group">
                  <label className="org-form__label">Ngày thành lập</label>
                  <div className="org-form__date-wrapper">
                    <input
                      className="org-form__input"
                      type="date"
                      value={form.founded_date}
                      onChange={(e) =>
                        setForm({ ...form, founded_date: e.target.value })
                      }
                    />
                    {form.founded_date && (
                      <button
                        className="org-form__clear-date"
                        onClick={() => setForm({ ...form, founded_date: "" })}
                        type="button"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="org-form__group">
                  <label className="org-form__label">Mô tả</label>
                  <textarea
                    className="org-form__textarea"
                    placeholder="Mô tả về chức năng, nhiệm vụ của đơn vị..."
                    rows="4"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <div className="org-form__char-count">
                    {form.description.length}/500
                  </div>
                </div>

                <div className="org-form__group">
                  <label className="org-form__label">
                    Thành tựu
                    <span className="org-form__optional"> (tùy chọn)</span>
                  </label>
                  <div className="org-form__achievement-input">
                    <input
                      className="org-form__input"
                      placeholder="Nhập thành tựu và nhấn Enter để thêm"
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
                    <button
                      className="org-form__add-achievement"
                      onClick={() => {
                        if (form.achievementInput.trim()) {
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
                      type="button"
                    >
                      Thêm
                    </button>
                  </div>
                  <p className="org-form__hint">
                    Nhấn Enter hoặc nút Thêm để thêm thành tựu
                  </p>
                </div>

                {form.achievements.length > 0 && (
                  <div className="org-achievements">
                    <div className="org-achievements__header">
                      <span className="org-achievements__title">
                        Danh sách thành tựu ({form.achievements.length})
                      </span>
                      <button
                        className="org-achievements__clear-all"
                        onClick={() => setForm({ ...form, achievements: [] })}
                        type="button"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="org-achievements__list">
                      {form.achievements.map((item, index) => (
                        <div key={index} className="org-achievements__item">
                          <span className="org-achievements__number">
                            {index + 1}.
                          </span>
                          <span className="org-achievements__text">{item}</span>
                          <button
                            className="org-achievements__remove"
                            onClick={() =>
                              setForm({
                                ...form,
                                achievements: form.achievements.filter(
                                  (_, i) => i !== index
                                ),
                              })
                            }
                            aria-label="Xóa thành tựu"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="org-modal__footer">
              <div className="org-modal__footer-actions">
                <button
                  className="org-modal__btn org-modal__btn--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className="org-modal__btn org-modal__btn--primary"
                  onClick={editOrg ? handleUpdateOrg : handleCreateOrg}
                  disabled={!form.name.trim()}
                >
                  {editOrg ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
              {!form.name.trim() && (
                <div className="org-modal__validation">
                  ⚠️ Vui lòng nhập tên đơn vị
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageOrganization;
