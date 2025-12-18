import React from "react";
import CreateAccount from "./Components/CreateAccountBox";
import FileUpload from "./Components/FileUpload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";

import "./CreateAccount_Page.css";

function CreateAccount_Page() {
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
          ]}
          buttonText="Tạo tài khoản"
        />
      </div>

      <Footer />
    </div>
  );
}

export default CreateAccount_Page;
