import { useState } from "react";
import "./CreateAccountBox.css"; // import css riêng

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let validPw = password;
    if (username.trim() === "" || password.trim() === "" || role === "") {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    // Nếu password dài hơn 12 ký tự thì chỉ lấy 12 ký tự đầu
    if (validPw.length > 12) {
      validPw = validPw.slice(0, 12);
    }

    // Kiểm tra password phải từ 6 đến 12 ký tự
    if (validPw.length < 6) {
      alert("Mật khẩu phải từ 6 đến 12 ký tự!");
      return;
    }

    // Nếu hợp lệ, cập nhật lại password (nếu đã cắt)
    if (validPw !== password) {
      setPassword(validPw);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-account-form">
      <h2 className="form-title">Tạo 1 tài khoản</h2>

      {/* Tên đăng nhập */}
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      {/* Mật khẩu */}
      <div className="form-group">
        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
        />
      </div>

      {/* Vai trò */}
      <div className="form-group">
        <label>Vai trò</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">-- Chọn vai trò --</option>
          <option value="sinhvien">Sinh viên</option>
          <option value="canbo">Cán bộ</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {/* Nút xác nhận */}
      <div className="submit-btn">
        <button type="submit">
          <span className="material-symbols-outlined">done_outline</span>
        </button>
      </div>

      {/* Ghi chú */}
      <div className="note">
        <p>Lưu ý:</p>
        <ul>
          <li>
            Tài khoản sinh viên mặc định tên đăng nhập và mật khẩu là mã số sinh
            viên
          </li>
          <li>
            Tài khoản cán bộ trong trường mặc định tên đăng nhập và mật khẩu là
            mã cán bộ
          </li>
        </ul>
      </div>
    </form>
  );
};

export default CreateAccount;
