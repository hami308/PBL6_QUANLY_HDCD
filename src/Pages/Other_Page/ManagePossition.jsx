import { useEffect, useState } from "react";
import {
  get_all_position,
  create_position,
  update_position,
} from "../../services/Position_Service";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

import "./ManageField.css"; // Dùng chung CSS với ManageField

const ManagePosition = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
  });

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const res = await get_all_position();
      console.log("Kiểm tra dữ liệu chức vụ:", res.data);
      // Kiểm tra xem dữ liệu trả về là array của objects hay array của strings
      if (Array.isArray(res.data)) {
        setPositions(res.data);
      } else {
        setPositions([]);
      }
    } catch (err) {
      alert("Lỗi tải danh sách chức vụ", err.message);
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
    // Kiểm tra xem item là object có property name hay là string
    setForm({ name: typeof item === "object" ? item.name : item });
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên chức vụ");
      return;
    }

    try {
      const res = await create_position({ name: form.name });
      if (!res.success) {
        alert(res.message || "Lỗi khi tạo chức vụ");
        return;
      }

      alert("Tạo chức vụ thành công!");
      setShowModal(false);
      loadPositions();
    } catch (error) {
      alert("Lỗi khi tạo chức vụ", error.message);
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên chức vụ");
      return;
    }

    if (!editItem) {
      alert("Không tìm thấy chức vụ cần cập nhật");
      return;
    }

    // Lấy ID từ editItem (có thể là object hoặc string)
    const itemId = typeof editItem === "object" ? editItem._id : editItem;

    try {
      const res = await update_position(itemId, { name: form.name });
      if (!res.success) {
        alert(res.message || "Lỗi khi cập nhật chức vụ");
        return;
      }

      alert("Cập nhật chức vụ thành công!");
      setShowModal(false);
      loadPositions();
    } catch (error) {
      alert("Lỗi khi cập nhật chức vụ", error.message);
    }
  };

  // Hàm để lấy tên hiển thị từ item
  const getDisplayName = (item) => {
    return typeof item === "object" ? item.name : item;
  };

  // Hàm để lấy ID từ item
  const getItemId = (item) => {
    return typeof item === "object" ? item._id : item;
  };

  return (
    <div className="manage-field">
      {" "}
      {/* Dùng class manage-field */}
      <Header />
      <Menu_Admin />
      <div className="manage-field__container">
        <div className="manage-field__header">
          <h2 className="manage-field__title">Quản lý chức vụ</h2>
        </div>

        <div className="manage-field__toolbar">
          <button className="manage-field__add-btn" onClick={openCreateModal}>
            + Thêm chức vụ
          </button>
        </div>

        {loading ? (
          <div className="manage-field__loading">Đang tải...</div>
        ) : positions.length === 0 ? (
          <div className="manage-field__empty">
            <p>Chưa có chức vụ nào</p>
            <button
              className="manage-field__empty-btn"
              onClick={openCreateModal}
            >
              Thêm chức vụ đầu tiên
            </button>
          </div>
        ) : (
          <div className="manage-field__table-wrapper">
            <table className="manage-field__table">
              <thead className="manage-field__thead">
                <tr>
                  <th className="manage-field__th">STT</th>
                  <th className="manage-field__th">Tên chức vụ</th>
                  <th className="manage-field__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="manage-field__tbody">
                {positions.map((position, index) => (
                  <tr
                    key={getItemId(position) || index}
                    className="manage-field__row"
                  >
                    <td className="manage-field__td">{index + 1}</td>
                    <td className="manage-field__td">
                      <div className="manage-field__name">
                        {getDisplayName(position)}
                      </div>
                    </td>
                    <td className="manage-field__td">
                      <div className="manage-field__actions">
                        <button
                          className="manage-field__edit-btn"
                          onClick={() => openEditModal(position)}
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
                {editItem ? "Cập nhật chức vụ" : "Thêm chức vụ mới"}
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
                  <label className="field-form__label">Tên chức vụ *</label>
                  <input
                    className="field-form__input"
                    placeholder="Nhập tên chức vụ"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <div className="field-form__hint">
                    Ví dụ: Giảng viên, Trưởng khoa, Phó khoa...
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

export default ManagePosition;
