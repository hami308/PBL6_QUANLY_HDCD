import React from "react";
import CreateAccount from "../../components/Admin/CreateAccountBox/CreateAccountBox";
import FileUpload from "../../components/Admin/FileUpload/FileUpload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import { uploadBulkUsers } from "../../services/UserBulkService";
import "./CreateAccount_Page.css";
function CreateAccount_Page() {
  const [role, setRole] = React.useState("student");
  const handleUpload = async (file) => {
    try {
      const res = await uploadBulkUsers(file);

      let msg = `Tạo thành công: ${res.success?.length || 0} tài khoản\n`;
      msg += `Thất bại: ${res.failed?.length || 0} dòng`;

      alert(msg);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi tạo tài khoản");
    }
  };

  return (
    <div className="createAccountPage">
      <Header />
      <Menu_Admin />

      <div className="form1_container">
        <CreateAccount />
      </div>
      <div className="thanhngang">
        <p>Tạo nhiều tài khoản sinh viên</p>
      </div>
      <div className="role-select">
        <label htmlFor="role">Chọn vai trò:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Sinh viên</option>
          <option value="teacher">Giảng viên, cán bộ</option>
        </select>
      </div>
      <div className="form2_container">
        <FileUpload
          title="Hướng dẫn:"
          guideLines={[
            "File Excel phải có cột: Mã số sinh viên, Tên sinh viên, Lớp, Khoa",
            "Dòng đầu tiên là tiêu đề cột",
            "Đảm bảo mã số sinh viên hợp lệ",
            "File không được vượt quá 5MB",
          ]}
          buttonText="Tải lên và tạo tài khoản"
          onSubmit={handleUpload}
        />
      </div>

      <Footer />
    </div>
  );
}

export default CreateAccount_Page;
