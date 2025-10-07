import React from "react";
import CreateAccount from "../../components/CreateAccountBox/CreateAccountBox";
import FileUpload from "../../components/FileUpload/FileUpload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_Admin from "../../components/Menu_Admin/Menu_Admin";
import "./CreateAccount_Page.css";
function CreateAccount_Page() {
  const [role, setRole] = React.useState("student");
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
          onSubmit={() => alert("Upload để tạo tài khoản")}
        />
      </div>

      <Footer />
    </div>
  );
}

export default CreateAccount_Page;
