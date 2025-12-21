import { useEffect, useState } from "react";
import {
  get_all_fields,
  create_field,
  update_field,
  // delete_field,
} from "../../services/Field_Service";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

import "./ManageField.css";

const ManageField = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
  });

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const res = await get_all_fields();
      setFields(res.data || []);
    } catch (err) {
      alert("Lỗi tải danh sách lĩnh vực", err.message);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditItem(null);
    setForm({ name: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({ name: item.name });
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên lĩnh vực");
      return;
    }

    try {
      const res = await create_field({ name: form.name });
      if (!res.success) {
        alert(res.message || "Lỗi khi tạo lĩnh vực");
        return;
      }

      alert("Tạo lĩnh vực thành công!");
      setShowModal(false);
      loadFields();
    } catch (error) {
      alert("Lỗi khi tạo lĩnh vực", error.message);
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên lĩnh vực");
      return;
    }

    if (!editItem) {
      alert("Không tìm thấy lĩnh vực cần cập nhật");
      return;
    }

    try {
      const res = await update_field(editItem._id, { name: form.name });
      if (!res.success) {
        alert(res.message || "Lỗi khi cập nhật lĩnh vực");
        return;
      }

      alert("Cập nhật lĩnh vực thành công!");
      setShowModal(false);
      loadFields();
    } catch (error) {
      alert("Lỗi khi cập nhật lĩnh vực", error.message);
    }
  };

  return (
    <div className="manage-field">
      <Header />
      <Menu_Admin />

      <div className="manage-field__container">
        <div className="manage-field__header">
          <h2 className="manage-field__title">Quản lý lĩnh vực</h2>
        </div>

        <div className="manage-field__toolbar">
          <button className="manage-field__add-btn" onClick={openCreateModal}>
            + Thêm lĩnh vực
          </button>
        </div>

        {loading ? (
          <div className="manage-field__loading">Đang tải...</div>
        ) : fields.length === 0 ? (
          <div className="manage-field__empty">
            <p>Chưa có lĩnh vực nào</p>
            <button
              className="manage-field__empty-btn"
              onClick={openCreateModal}
            >
              Thêm lĩnh vực đầu tiên
            </button>
          </div>
        ) : (
          <div className="manage-field__table-wrapper">
            <table className="manage-field__table">
              <thead className="manage-field__thead">
                <tr>
                  <th className="manage-field__th">STT</th>
                  <th className="manage-field__th">Tên lĩnh vực</th>
                  <th className="manage-field__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="manage-field__tbody">
                {fields.map((field, index) => (
                  <tr key={field._id} className="manage-field__row">
                    <td className="manage-field__td">{index + 1}</td>
                    <td className="manage-field__td">
                      <div className="manage-field__name">{field.name}</div>
                    </td>
                    <td className="manage-field__td">
                      <div className="manage-field__actions">
                        <button
                          className="manage-field__edit-btn"
                          onClick={() => openEditModal(field)}
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

      {/* MODAL */}
      {showModal && (
        <div className="field-modal">
          <div
            className="field-modal__overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="field-modal__content">
            <div className="field-modal__header">
              <h3 className="field-modal__title">
                {editItem ? "Cập nhật lĩnh vực" : "Thêm lĩnh vực mới"}
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
                  <label className="field-form__label">Tên lĩnh vực *</label>
                  <input
                    className="field-form__input"
                    placeholder="Nhập tên lĩnh vực"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
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
                  disabled={!form.name.trim()}
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

export default ManageField;
