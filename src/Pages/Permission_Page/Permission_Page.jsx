import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import ActionGroup from "../../components/Admin/Permisson/ActionGroup";
import "./Permission_Page.css";

const PermissionPage = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);

  // mock quyền
  const permissions = {
    student: ["Xem hoạt động", "Đăng ký hoạt động"],
    staff: ["Duyệt minh chứng", "Quản lý hoạt động"],
  };

  // giả lập API tìm user
  const handleSearchUser = () => {
    if (!username) return alert("Nhập username");

    // MOCK DATA
    const mockUser = {
      username,
      roles: ["student"], // ban đầu chỉ là student
    };

    setUserData(mockUser);
    setSelectedRole(mockUser.roles[0]);
  };

  const handleAddStaffRole = () => {
    setUserData({
      ...userData,
      roles: [...userData.roles, "staff"],
    });
    setShowAddRole(false);
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      {/* ==== SEARCH USER ==== */}
      <div className="search-box">
        <input
          placeholder="Nhập username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearchUser}>✔</button>
      </div>

      {/* ==== USER INFO ==== */}
      {userData && (
        <>
          <div className="user-info">
            <p>
              User: <b>{userData.username}</b>
            </p>

            <div className="role-radio">
              {userData.roles.map((r) => (
                <label key={r}>
                  <input
                    type="radio"
                    checked={selectedRole === r}
                    onChange={() => setSelectedRole(r)}
                  />
                  {r}
                </label>
              ))}
            </div>

            {/* chỉ student mới có */}
            {userData.roles.includes("student") &&
              !userData.roles.includes("staff") && (
                <button
                  className="add-role-btn"
                  onClick={() => setShowAddRole(true)}
                >
                  + Thêm role tổ chức
                </button>
              )}
          </div>

          {/* ==== ADD STAFF ROLE ==== */}
          {showAddRole && (
            <div className="add-role-form">
              <select>
                <option>Chọn đơn vị tổ chức</option>
                <option>Đoàn trường</option>
                <option>CLB IT</option>
              </select>

              <select>
                <option>Chọn chức vụ</option>
                <option>Trưởng ban</option>
                <option>Thành viên</option>
              </select>

              <button onClick={handleAddStaffRole}>Lưu</button>
            </div>
          )}

          {/* ==== PERMISSIONS ==== */}
          <div className="Action_group">
            <ActionGroup
              title={`Quyền của role ${selectedRole}`}
              actions={permissions[selectedRole]}
            />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default PermissionPage;
