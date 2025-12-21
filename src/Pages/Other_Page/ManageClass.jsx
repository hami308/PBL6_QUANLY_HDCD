import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ManageClass.css";
import {
  getClassesByFaculty,
  createClass,
  updateClass,
  // deleteClass,
} from "../../services/Class_Service";

import { get_all_cohort } from "../../services/Cohort_Services";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

const ManageClass = () => {
  const { facultyId } = useParams();
  const location = useLocation();
  const facultyName = location.state?.facultyName || "Tên khoa không xác định";

  const [classes, setClasses] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);

  const [form, setForm] = useState({
    name: "",
    cohort_id: "",
  });

  // Load danh sách lớp + danh sách cohort
  useEffect(() => {
    loadClasses();
    loadCohorts();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await getClassesByFaculty(facultyId);
      setClasses(res.data || []);
    } catch (err) {
      alert(err.message || "Lỗi không xác định");
    }
    setLoading(false);
  };

  const loadCohorts = async () => {
    try {
      const res = await get_all_cohort();
      setCohorts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Mở modal thêm lớp
  const openCreateModal = () => {
    setEditClass(null);
    setForm({ name: "", cohort_id: "" });
    setShowModal(true);
  };

  // Mở modal sửa lớp
  const openEditModal = (cls) => {
    setEditClass(cls);
    setForm({
      name: cls.name,
      cohort_id: cls.cohort_id || "",
    });
    setShowModal(true);
  };

  // Thêm lớp
  const handleCreateClass = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên lớp");
      return;
    }

    try {
      const res = await createClass({
        name: form.name,
        faculty_id: facultyId,
        cohort_id: form.cohort_id,
      });
      if (res.success) {
        alert("Tạo lớp thành công!");
        setShowModal(false);
        loadClasses();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || "Lỗi không xác định");
    }
  };

  // Cập nhật lớp
  const handleUpdateClass = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên lớp");
      return;
    }

    try {
      const res = await updateClass(editClass._id, {
        name: form.name,
        cohort_id: form.cohort_id,
      });
      if (!res.success) {
        alert(res.message);
        return;
      }
      alert("Cập nhật lớp thành công!");
      setShowModal(false);
      loadClasses();
    } catch (err) {
      alert(err.message || "Lỗi không xác định");
    }
  };

  return (
    <div className="manage-class">
      <Header />
      <Menu_Admin />

      <div className="manage-class__container">
        <div className="manage-class__header">
          <h2 className="manage-class__title">Quản lý lớp học</h2>
          <div className="manage-class__faculty-info">
            <span className="manage-class__faculty-label">Khoa:</span>
            <span className="manage-class__faculty-name">{facultyName}</span>
          </div>
          <p className="manage-class__subtitle">
            Quản lý và cập nhật thông tin các lớp học trong khoa
          </p>
        </div>

        <div className="manage-class__toolbar">
          <button className="manage-class__add-btn" onClick={openCreateModal}>
            <span className="manage-class__add-icon">+</span>
            Thêm lớp mới
          </button>
          <div className="manage-class__stats">
            <span className="manage-class__stat">
              Tổng số lớp: <strong>{classes.length}</strong>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="manage-class__loading-container">
            <div className="manage-class__loading-spinner"></div>
            <p className="manage-class__loading-text">Đang tải dữ liệu...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="manage-class__empty">
            <div className="manage-class__empty-icon">🏫</div>
            <h3 className="manage-class__empty-title">Chưa có lớp học</h3>
            <p className="manage-class__empty-description">
              Bắt đầu bằng cách thêm lớp học đầu tiên cho khoa này
            </p>
            <button
              className="manage-class__empty-btn"
              onClick={openCreateModal}
            >
              Thêm lớp đầu tiên
            </button>
          </div>
        ) : (
          <div className="manage-class__table-wrapper">
            <table className="manage-class__table">
              <thead className="manage-class__thead">
                <tr>
                  <th className="manage-class__th">Tên lớp</th>
                  <th className="manage-class__th">Khóa học</th>
                  <th className="manage-class__th">Hành động</th>
                </tr>
              </thead>
              <tbody className="manage-class__tbody">
                {classes.map((cls) => (
                  <tr key={cls._id} className="manage-class__row">
                    <td className="manage-class__td">
                      <div className="manage-class__class-info">
                        <div className="manage-class__class-name">
                          {cls.name}
                        </div>
                      </div>
                    </td>
                    <td className="manage-class__td">
                      <div className="manage-class__cohort">
                        {cls.cohort_id ? (
                          <div className="manage-class__cohort-info">
                            <span className="manage-class__cohort-year">
                              Khóa {cls.cohort_id.year}
                            </span>
                          </div>
                        ) : (
                          <span className="manage-class__no-cohort">
                            Chưa có khóa
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="manage-class__td">
                      <div className="manage-class__actions">
                        <button
                          className="manage-class__edit-btn"
                          onClick={() => openEditModal(cls)}
                          title="Chỉnh sửa lớp"
                        >
                          <span className="manage-class__edit-icon">✏️</span>
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
        <div className="class-modal">
          <div
            className="class-modal__overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="class-modal__content">
            <div className="class-modal__header">
              <div className="class-modal__header-content">
                <div className="class-modal__icon">
                  {editClass ? "✏️" : "➕"}
                </div>
                <div>
                  <h3 className="class-modal__title">
                    {editClass ? "Cập nhật lớp học" : "Thêm lớp học mới"}
                  </h3>
                  <p className="class-modal__subtitle">
                    {editClass
                      ? "Cập nhật thông tin chi tiết của lớp học"
                      : "Nhập thông tin chi tiết của lớp học mới"}
                  </p>
                </div>
              </div>
              <button
                className="class-modal__close"
                onClick={() => setShowModal(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="class-modal__body">
              <div className="class-form">
                <div className="class-form__group">
                  <label className="class-form__label">
                    Tên lớp
                    <span className="class-form__required">*</span>
                  </label>
                  <input
                    className="class-form__input"
                    placeholder="Ví dụ: D20_TH01"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <div className="class-form__hint">
                    Tên lớp phải là duy nhất trong khoa
                  </div>
                </div>

                <div className="class-form__group">
                  <label className="class-form__label">
                    Khóa học
                    <span className="class-form__optional"> (tùy chọn)</span>
                  </label>
                  <select
                    className="class-form__select"
                    value={form.cohort_id}
                    onChange={(e) =>
                      setForm({ ...form, cohort_id: e.target.value })
                    }
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {cohorts.map((co) => (
                      <option key={co._id} value={co._id}>
                        Khóa {co.year}
                      </option>
                    ))}
                  </select>
                  <div className="class-form__hint">
                    Liên kết lớp với một khóa học cụ thể
                  </div>
                </div>

                <div className="class-form__preview">
                  <div className="class-form__preview-title">
                    Thông tin xem trước:
                  </div>
                  <div className="class-form__preview-content">
                    <div className="class-form__preview-item">
                      <span className="class-form__preview-label">Khoa:</span>
                      <span className="class-form__preview-value">
                        {facultyName}
                      </span>
                    </div>
                    <div className="class-form__preview-item">
                      <span className="class-form__preview-label">
                        Tên lớp:
                      </span>
                      <span className="class-form__preview-value">
                        {form.name || "Chưa nhập"}
                      </span>
                    </div>
                    <div className="class-form__preview-item">
                      <span className="class-form__preview-label">Khóa:</span>
                      <span className="class-form__preview-value">
                        {form.cohort_id
                          ? `Khóa ${
                              cohorts.find((c) => c._id === form.cohort_id)
                                ?.year || "..."
                            }`
                          : "Chưa chọn"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="class-modal__footer">
              <div className="class-modal__footer-actions">
                <button
                  className="class-modal__btn class-modal__btn--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className="class-modal__btn class-modal__btn--primary"
                  onClick={editClass ? handleUpdateClass : handleCreateClass}
                  disabled={!form.name.trim()}
                >
                  {editClass ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
              {!form.name.trim() && (
                <div className="class-modal__validation">
                  ⚠️ Vui lòng nhập tên lớp
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

export default ManageClass;
