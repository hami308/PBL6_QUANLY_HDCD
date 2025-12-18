import React from "react";
import CreateAccount from "../../components/Admin/CreateAccountBox/CreateAccountBox";
import FileUpload from "../../components/Admin/FileUpload/FileUpload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import { uploadBulkUsers } from "../../services/UserBulkService";
import "./CreateAccount_Page.css";

function CreateAccount_Page() {
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

  const handleDownloadTemplate = () => {
    window.open("/templates/templates.xlsx", "_blank");
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

      {/* 🔽 NÚT TẢI TEMPLATE Ở PAGE */}
      <div className="template-download">
        <button
          className="download-template-btn"
          onClick={handleDownloadTemplate}
        >
          📥 Tải template Excel
        </button>
      </div>

      <div className="form2_container">
        <FileUpload
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
