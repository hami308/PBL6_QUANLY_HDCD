import CreateAccount from "./components/CreateAccountBox/CreateAccountBox.jsx";
// import { Delete_Account } from "./components/DeleteAccountBox/DeleteAccountBox.jsx";
// import FileUploadBox from "./components/FileUpload/FileUpload.jsx";
function App() {
  return (
    <div>
      <CreateAccount />
      {/* <Delete_Account />
      <FileUploadBox
        guideLines={[
          "File Exel phải có cột: Mã số sinh viên hoặc mã số cán bộ",
          "Dòng đầu tiên là tiêu đề cột",
          "Đảm bảo mã số sinh viên hợp lệ",
          "File không được vượt quá 5MB",
        ]}
        buttonText="Xóa tất cả tài khoản"
        onSubmit={() => alert("Upload để xóa tài khoản")}
      /> */}
    </div>
  );
}
export default App;
