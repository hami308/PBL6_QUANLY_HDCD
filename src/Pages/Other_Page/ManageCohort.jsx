import { useEffect, useState } from "react";
import {
  get_all_cohort,
  create_cohort,
  update_cohort,
  // delete_cohort,
} from "../../services/Cohort_Services";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

import "./ManageField.css"; // Dùng chung CSS với ManageField

const ManageCohort = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    year: "",
  });

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      const res = await get_all_cohort();
      setCohorts(res.data || []);
    } catch (err) {
      alert("Lỗi tải danh sách khóa", err.message);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditItem(null);
    setForm({ year: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({ year: item.year });
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.year.trim() || isNaN(form.year)) {
      alert("Vui lòng nhập năm hợp lệ");
      return;
    }

    try {
      const res = await create_cohort({ year: form.year });
      if (!res.success) {
        alert(res.message || "Lỗi khi tạo khóa");
        return;
      }

      alert("Tạo khóa thành công!");
      setShowModal(false);
      loadCohorts();
    } catch (error) {
      alert("Lỗi khi tạo khóa", error.message);
    }
  };

  const handleUpdate = async () => {
    if (!form.year.trim() || isNaN(form.year)) {
      alert("Vui lòng nhập năm hợp lệ");
      return;
    }

    if (!editItem) {
      alert("Không tìm thấy khóa cần cập nhật");
      return;
    }

    try {
      const res = await update_cohort(editItem._id, { year: form.year });
      if (!res.success) {
        alert(res.message || "Lỗi khi cập nhật khóa");
        return;
      }

      alert("Cập nhật khóa thành công!");
      setShowModal(false);
      loadCohorts();
    } catch (error) {
      alert("Lỗi khi cập nhật khóa", error.message);
    }
  };

  return (
    <div className="manage-field">
      {" "}
      {/* Dùng class manage-field */}
      <Header />
      <Menu_Admin />
      <div className="manage-field__container">
        <div className="manage-field__header">
          <h2 className="manage-field__title">Quản lý khóa học</h2>
        </div>

        <div className="manage-field__toolbar">
          <button className="manage-field__add-btn" onClick={openCreateModal}>
            + Thêm khóa học
          </button>
        </div>

        {loading ? (
          <div className="manage-field__loading">Đang tải...</div>
        ) : cohorts.length === 0 ? (
          <div className="manage-field__empty">
            <p>Chưa có khóa học nào</p>
            <button
              className="manage-field__empty-btn"
              onClick={openCreateModal}
            >
              Thêm khóa đầu tiên
            </button>
          </div>
        ) : (
          <div className="manage-field__table-wrapper">
            <table className="manage-field__table">
              <thead className="manage-field__thead">
                <tr>
                  <th className="manage-field__th">STT</th>
                  <th className="manage-field__th">Khóa học</th>
                  <th className="manage-field__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="manage-field__tbody">
                {cohorts.map((cohort, index) => (
                  <tr key={cohort._id} className="manage-field__row">
                    <td className="manage-field__td">{index + 1}</td>
                    <td className="manage-field__td">
                      <div className="manage-field__name">
                        Khóa {cohort.year}
                      </div>
                    </td>
                    <td className="manage-field__td">
                      <div className="manage-field__actions">
                        <button
                          className="manage-field__edit-btn"
                          onClick={() => openEditModal(cohort)}
                        >
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
      {/* MODAL - dùng class field-modal */}
      {showModal && (
        <div className="field-modal">
          <div
            className="field-modal__overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="field-modal__content">
            <div className="field-modal__header">
              <h3 className="field-modal__title">
                {editItem ? "Cập nhật khóa học" : "Thêm khóa học mới"}
              </h3>
              <button
                className="field-modal__close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="field-modal__body">
              <div className="field-form">
                <div className="field-form__group">
                  <label className="field-form__label">Năm khóa *</label>
                  <input
                    className="field-form__input"
                    placeholder="Nhập năm (ví dụ: 2024)"
                    type="number"
                    min="2000"
                    max="2100"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                  <div className="field-form__hint">
                    Nhập năm bắt đầu của khóa học
                  </div>
                </div>
              </div>
            </div>

            <div className="field-modal__footer">
              <div className="field-modal__footer-actions">
                <button
                  className="field-modal__btn field-modal__btn--cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="field-modal__btn field-modal__btn--save"
                  onClick={editItem ? handleUpdate : handleCreate}
                  disabled={!form.year.trim() || isNaN(form.year)}
                >
                  {editItem ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ManageCohort;
