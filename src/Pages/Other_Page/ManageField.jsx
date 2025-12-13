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
      alert(err.message || "Lỗi tải danh sách lĩnh vực");
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
    const res = await create_field({ name: form.name });
    if (!res.success) return alert(res.message);

    alert("Tạo lĩnh vực thành công!");
    setShowModal(false);
    loadFields();
  };

  const handleUpdate = async () => {
    const res = await update_field(editItem._id, { name: form.name });
    if (!res.success) return alert(res.message);

    alert("Cập nhật lĩnh vực thành công!");
    setShowModal(false);
    loadFields();
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Bạn có chắc muốn xóa lĩnh vực này?")) return;

  //   const res = await delete_field(id);
  //   if (!res.success) return alert(res.message);

  //   alert("Xóa lĩnh vực thành công!");
  //   loadFields();
  // };

  return (
    <div>
      <Header />
      <Menu_Admin />

      <div className="faculty-container">
        <h2>Danh sách lĩnh vực</h2>

        <button className="btn-primary" onClick={openCreateModal}>
          + Thêm lĩnh vực
        </button>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="faculty-table">
            <thead>
              <tr>
                <th>Tên lĩnh vực</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {fields.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(f)}
                    >
                      Sửa
                    </button>

                    {/* <button
                      className="btn-delete"
                      onClick={() => handleDelete(f._id)}
                    >
                      Xóa
                    </button> */}
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
            <h3>{editItem ? "Cập nhật lĩnh vực" : "Thêm lĩnh vực mới"}</h3>

            <input
              placeholder="Nhập tên lĩnh vực..."
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

export default ManageField;
