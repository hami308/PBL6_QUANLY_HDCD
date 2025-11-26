import { useEffect, useState } from "react";
import {
  get_all_cohort,
  create_cohort,
  update_cohort,
  delete_cohort,
} from "../../services/Cohort_Services";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

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
      alert(err.message || "Lỗi tải danh sách khóa");
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
    const res = await create_cohort({ year: form.year });
    if (!res.success) return alert(res.message);

    alert("Tạo khóa thành công!");
    setShowModal(false);
    loadCohorts();
  };

  const handleUpdate = async () => {
    const res = await update_cohort(editItem._id, { year: form.year });
    if (!res.success) return alert(res.message);

    alert("Cập nhật khóa thành công!");
    setShowModal(false);
    loadCohorts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa này?")) return;

    const res = await delete_cohort(id);
    if (!res.success) return alert(res.message);

    alert("Xóa khóa thành công!");
    loadCohorts();
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="faculty-container">
        <h2>Danh sách khóa học</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm khóa học
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Khóa</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {cohorts.map((c) => (
                <tr key={c._id}>
                  <td>Khóa {c.year}</td>

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
            <h3>{editItem ? "Cập nhật khóa học" : "Thêm khóa học mới"}</h3>

            <input
              placeholder="Nhập năm khóa (ví dụ: 2024)"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={editItem ? handleUpdate : handleCreate}
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

export default ManageCohort;
