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

  // Load danh sách khoa
  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      const data = await get_all_faculties();
      // console.log(data);
      setFaculties(data.data);
    } catch (err) {
      alert("Lỗi tải khoa!", err.message || "Lỗi không xác định");
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
    setForm({
      name: faculty.name,
    });
    setShowModal(true);
  };

  const handleCreateFaculty = async () => {
    try {
      const response = await create_faculty(form);
      if (response.success == true) {
        // console.log("Create faculty response:", response);
        alert("Đã thêm khoa " + response.data.name + " thành công!");
        setShowModal(false);
        loadFaculties();
      }
    } catch (error) {
      alert("Lỗi tạo khoa!", error.message || "Lỗi không xác định");
    }
  };
  const handleUpdateFaculty = async () => {
    try {
      await update_faculty(editFaculty._id, form);
      alert("Cập nhật khoa thành công!");
      setShowModal(false);
      loadFaculties();
    } catch (error) {
      alert("Lỗi cập nhật khoa!", error.message || "Lỗi không xác định");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoa này?")) return;

    try {
      await delete_faculty(id);
      alert("Xóa thành công!");
      loadFaculties();
    } catch (err) {
      alert("Lỗi khi xóa khoa :", err.message || "Lỗi không xác định");
    }
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="faculty-container">
        <h2>Danh sách các khoa</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm khoa
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Tên khoa</th>
                {/* <th></th>
                <th></th> */}
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  {/* <td>{f.code}</td>
                  <td>{f.description}</td> */}
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
                    <button
                      className="btn-xem"
                      onClick={() =>
                        navigate(`/manage-class/${f._id}`, {
                          state: { facultyName: f.name },
                        })
                      }
                    >
                      Xem danh sách lớp
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
            <h3>{editFaculty ? "Cập nhật khoa" : "Thêm khoa mới"}</h3>

            <input
              placeholder="Tên khoa"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={
                  editFaculty ? handleUpdateFaculty : handleCreateFaculty
                }
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

export default ManageFaculty;
