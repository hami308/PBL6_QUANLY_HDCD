import { useEffect, useState } from "react";
import {
  get_all_position,
  create_position,
  update_position,
  delete_position,
} from "../../services/Position_Service";

import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";

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
      console.log("kiểm tra ", res);
      setPositions(res.data || []);
    } catch (err) {
      alert(err.message || "Lỗi tải danh sách chức vụ");
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
    const res = await create_position({ name: form.name });
    if (!res.success) return alert(res.message);

    alert("Tạo chức vụ thành công!");
    setShowModal(false);
    loadPositions();
  };

  const handleUpdate = async () => {
    const res = await update_position(editItem._id, { name: form.name });
    if (!res.success) return alert(res.message);

    alert("Cập nhật chức vụ thành công!");
    setShowModal(false);
    loadPositions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chức vụ này?")) return;

    const res = await delete_position(id);
    if (!res.success) return alert(res.message);

    alert("Xóa chức vụ thành công!");
    loadPositions();
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="faculty-container">
        <h2>Danh sách chức vụ</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm chức vụ
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Tên chức vụ</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {positions.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(p)}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(p._id)}
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
            <h3>{editItem ? "Cập nhật chức vụ" : "Thêm chức vụ mới"}</h3>

            <input
              placeholder="Nhập tên chức vụ..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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

export default ManagePosition;
