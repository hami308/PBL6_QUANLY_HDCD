import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ManageClass.css";
import {
  getClassesByFaculty,
  createClass,
  updateClass,
  deleteClass,
} from "../../services/Class_Service";

import { get_all_cohort } from "../../services/Cohort_Services";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

import "./ManageClass.css";

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
      console.log(res.data);
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

  // Xóa lớp
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lớp này?")) return;

    try {
      const res = await deleteClass(id);
      if (!res.success) {
        alert(res.message);
        return;
      }
      alert("Đã xóa lớp!");
      loadClasses();
    } catch (err) {
      alert(err.message || "Lỗi không xác định");
    }
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="faculty-container">
        <h2>Danh sách lớp của khoa: {facultyName}</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm lớp
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Tên lớp</th>
                <th>Khóa</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.cohort_id?.year || "Không có"}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(c)}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(c._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editClass ? "Cập nhật lớp" : "Thêm lớp mới"}</h3>

            <input
              placeholder="Tên lớp"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Chọn khóa (cohort) */}
            <select
              value={form.cohort_id}
              onChange={(e) => setForm({ ...form, cohort_id: e.target.value })}
            >
              <option value="">-- Chọn khóa học --</option>

              {cohorts.map((co) => (
                <option key={co._id} value={co._id}>
                  Khóa {co.year}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={editClass ? handleUpdateClass : handleCreateClass}
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

export default ManageClass;
