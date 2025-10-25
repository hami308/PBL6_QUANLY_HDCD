import ActionGroup from "../../components/Admin/Permisson/ActionGroup";
import PositionBox from "../../components/Admin/Permisson/PossitionBox";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import RoleSelector from "../../components/Admin/Permisson/RoleSelector";
import "./Permission_Page.css";
import { useLocation } from "react-router-dom";
const PermissionPage = () => {
  const location = useLocation();
  const { username, role } = location.state || {};

  const actions = [
    "Duyệt minh chứng cho các hoạt động ngoài trường ",
    "Read",
    "Update",
    "Delete",
  ];
  const handleConfirm = () => {
    // Xử lý khi nhấn nút xác nhận
    alert("Quyền đã được cập nhật!");
  };
  return (
    <div>
      <Header />
      <Menu_Admin />
      <div className="Position_Box">
        <PositionBox username={username} />
      </div>
      <div className="Role_Selector">
        <RoleSelector role={role} />
      </div>
      <div className="Permission_Title">
        <p>Chọn các quyền được phép sử dụng</p>
      </div>
      <div className="Confirm_Button_Container">
        <button className="Confirm_Button" onClick={handleConfirm}>
          Xác nhận
        </button>
      </div>
      <div className="Action_group">
        <ActionGroup title="User Actions" actions={actions} />
        <ActionGroup title="User Actions" actions={actions} />
        <ActionGroup title="User Actions" actions={actions} />
        <ActionGroup title="User Actions" actions={actions} />
        <ActionGroup title="User Actions" actions={actions} />
        <ActionGroup title="User Actions" actions={actions} />
      </div>
      <Footer />
    </div>
  );
};

export default PermissionPage;
