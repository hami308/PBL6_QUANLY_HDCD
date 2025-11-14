import { useEffect, useState } from "react";
import {
  get_all_faculties,
  create_faculty,
  update_faculty,
  delete_faculty,
} from "../../services/Faculty_Service";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

import "./ManageFaculty.css";

const ManageFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  // Load danh sách khoa
  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      const data = await get_all_faculties();
      setFaculties(data);
    } catch (err) {
      alert("Lỗi tải khoa!", err.message || "Lỗi không xác định");
    }
    setLoading(false);
  };

  // Mở modal thêm
  const openCreateModal = () => {
    setEditFaculty(null);
    setForm({ name: "", code: "", description: "" });
    setShowModal(true);
  };

  // Mở modal sửa
  const openEditModal = (faculty) => {
    setEditFaculty(faculty);
    setForm({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editFaculty) {
        await update_faculty(editFaculty._id, form);
        alert("Cập nhật khoa thành công!");
      } else {
        await create_faculty(form);
        alert("Tạo khoa thành công!");
      }

      setShowModal(false);
      loadFaculties();
    } catch (err) {
      alert(err.message || "Lỗi khi lưu!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoa này?")) return;

    try {
      await delete_faculty(id);
      alert("Xóa thành công!");
      loadFaculties();
    } catch (err) {
      alert("Lỗi khi xóa khoa!", err.message || "Lỗi không xác định");
    }
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="faculty-container">
        <h2>Quản lý Khoa</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm Khoa
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Tên khoa</th>
                <th>Mã khoa</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.code}</td>
                  <td>{f.description}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(f)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(f._id)}
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

      {/* Modal thêm / sửa */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editFaculty ? "Cập nhật Khoa" : "Thêm Khoa Mới"}</h3>

            <input
              placeholder="Tên khoa"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Mã khoa"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />

            <textarea
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSave}>
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

export default ManageFaculty;
