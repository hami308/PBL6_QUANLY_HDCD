import { useEffect, useState } from "react";
import {
  get_all_faculties,
  create_faculty,
  update_faculty,
} from "../../services/Faculty_Service";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Menu_org from "../../components/Menu/Menu_org";
import Footer from "../../components/Footer/Footer";

import "./ManageFaculty.css";
import { useNavigate } from "react-router-dom";

const ManageFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
  });

  const role = sessionStorage.getItem("role");

  // Load danh sách khoa
  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      const data = await get_all_faculties();
      setFaculties(data.data || []);
    } catch (err) {
      alert("Lỗi tải khoa!", err.message);
    }
    setLoading(false);
  };

  // Mở modal thêm
  const openCreateModal = () => {
    setEditFaculty(null);
    setForm({ name: "" });
    setShowModal(true);
  };

  // Mở modal sửa
  const openEditModal = (faculty) => {
    setEditFaculty(faculty);
    setForm({ name: faculty.name });
    setShowModal(true);
  };

  const handleCreateFaculty = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên khoa");
      return;
    }

    try {
      const response = await create_faculty(form);
      if (response.success === true) {
        alert(`Đã thêm khoa ${response.data.name} thành công!`);
        setShowModal(false);
        loadFaculties();
      }
    } catch (error) {
      alert("Lỗi tạo khoa!", error.message);
    }
  };

  const handleUpdateFaculty = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên khoa");
      return;
    }

    try {
      const response = await update_faculty(editFaculty._id, form);
      if (response) {
        alert("Cập nhật khoa thành công!");
        setShowModal(false);
        loadFaculties();
      }
    } catch (error) {
      alert("Lỗi cập nhật khoa!", error.message);
    }
  };

  return (
    <div className="manage-faculty">
      <Header />
      {role === "admin" ? <Menu_Admin /> : <Menu_org />}

      <div className="manage-faculty__container">
        <div className="manage-faculty__header">
          <h2 className="manage-faculty__title">Quản lý khoa</h2>
        </div>

        <div className="manage-faculty__toolbar">
          <button className="manage-faculty__add-btn" onClick={openCreateModal}>
            + Thêm khoa mới
          </button>
        </div>

        {loading ? (
          <div className="manage-faculty__loading">Đang tải...</div>
        ) : faculties.length === 0 ? (
          <div className="manage-faculty__empty">
            <p>Chưa có khoa nào</p>
            <button
              className="manage-faculty__empty-btn"
              onClick={openCreateModal}
            >
              Thêm khoa đầu tiên
            </button>
          </div>
        ) : (
          <div className="manage-faculty__table-wrapper">
            <table className="manage-faculty__table">
              <thead className="manage-faculty__thead">
                <tr>
                  <th className="manage-faculty__th">STT</th>
                  <th className="manage-faculty__th">Tên khoa</th>
                  <th className="manage-faculty__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="manage-faculty__tbody">
                {faculties.map((faculty, index) => (
                  <tr key={faculty._id} className="manage-faculty__row">
                    <td className="manage-faculty__td">{index + 1}</td>
                    <td className="manage-faculty__td">
                      <div className="manage-faculty__name">{faculty.name}</div>
                    </td>
                    <td className="manage-faculty__td">
                      <div className="manage-faculty__actions">
                        <button
                          className="manage-faculty__edit-btn"
                          onClick={() => openEditModal(faculty)}
                        >
                          Sửa
                        </button>
                        <button
                          className="manage-faculty__view-btn"
                          onClick={() =>
                            navigate(`/manage-class/${faculty._id}`, {
                              state: { facultyName: faculty.name },
                            })
                          }
                        >
                          Xem lớp
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
        <div className="faculty-modal">
          <div
            className="faculty-modal__overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="faculty-modal__content">
            <div className="faculty-modal__header">
              <h3 className="faculty-modal__title">
                {editFaculty ? "Cập nhật khoa" : "Thêm khoa mới"}
              </h3>
              <button
                className="faculty-modal__close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="faculty-modal__body">
              <div className="faculty-form">
                <div className="faculty-form__group">
                  <label className="faculty-form__label">Tên khoa *</label>
                  <input
                    className="faculty-form__input"
                    placeholder="Nhập tên khoa"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="faculty-modal__footer">
              <div className="faculty-modal__footer-actions">
                <button
                  className="faculty-modal__btn faculty-modal__btn--cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="faculty-modal__btn faculty-modal__btn--save"
                  onClick={
                    editFaculty ? handleUpdateFaculty : handleCreateFaculty
                  }
                  disabled={!form.name.trim()}
                >
                  {editFaculty ? "Cập nhật" : "Lưu"}
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

export default ManageFaculty;
