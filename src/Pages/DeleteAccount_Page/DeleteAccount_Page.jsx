import React from "react";
import DeleteAccount from "../../components/Admin/DeleteAccountBox/DeleteAccountBox";
import FileUpload from "../../components/Admin/FileUpload/FileUpload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import "./DeleteAccount_Page.css";
function DeleteAccount_Page() {
  return (
    <div className="DeleteAccountPage">
      <Header />
      <Menu_Admin />

      <div className="form1_container">
        <DeleteAccount />
      </div>
      <div className="thanhngang">
        <p>Xóa nhiều tài khoản</p>
      </div>
      <div className="form2_container">
        <FileUpload
          title="Hướng dẫn:"
          guideLines={[
            "File Excel phải có cột: Mã số sinh viên hoặc mã số cán bộ",
            "Dòng đầu tiên là tiêu đề cột",
            "Đảm bảo mã số sinh viên hợp lệ",
            "File không được vượt quá 5MB",
          ]}
          buttonText="Xóa tất cả tài khoản"
          onSubmit={() => alert("Upload để xóa tài khoản")}
        />
      </div>

      <Footer />
    </div>
  );
}

export default DeleteAccount_Page;
