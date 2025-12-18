import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import ActionGroup from "../../components/Admin/Permisson/ActionGroup";
import { get_role_permissions } from "../../services/Permission_Service";
import "./Permission_Page.css";

const PermissionPage = () => {
  // ===== USER SEARCH =====
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);

  // ===== ROLE & PERMISSION =====
  const [selectedRole, setSelectedRole] = useState("student");
  const [permissions, setPermissions] = useState([]);

  // ===== ADD ROLE =====
  const [showAddRole, setShowAddRole] = useState(false);

  // =====================================
  // 1️⃣ LOAD PERMISSION THEO ROLE (KHI VÀO TRANG + KHI ĐỔI ROLE)
  // =====================================
  useEffect(() => {
    if (!selectedRole) return;

    const fetchPermissions = async () => {
      const res = await get_role_permissions(selectedRole);
      if (res.success) {
        setPermissions(res.data);
      } else {
        alert(res.message);
      }
    };

    fetchPermissions();
  }, [selectedRole]);

  // =====================================
  // 2️⃣ SEARCH USER (MOCK – SAU NÀY ĐỔI API)
  // =====================================
  const handleSearchUser = () => {
    if (!username.trim()) {
      alert("Vui lòng nhập username");
      return;
    }

    // 🔥 MOCK DATA (thay bằng API get user sau)
    const mockUser = {
      username,
      roles: ["student"], // user ban đầu chỉ là student
    };

    setUserData(mockUser);
    setSelectedRole(mockUser.roles[0]);
  };

  // =====================================
  // 3️⃣ THÊM ROLE STAFF CHO USER
  // =====================================
  const handleAddStaffRole = () => {
    setUserData((prev) => ({
      ...prev,
      roles: [...prev.roles, "staff"],
    }));

    setSelectedRole("staff");
    setShowAddRole(false);
  };

  return (
    <div>
      <Header />
      <Menu_Admin />

      {/* ================= SEARCH USER ================= */}
      <div className="search-box">
        <input
          placeholder="Nhập username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearchUser}>✔</button>
      </div>

      {/* ================= USER INFO ================= */}
      {userData && (
        <>
          <div className="user-info">
            <p>
              User: <b>{userData.username}</b>
            </p>

            {/* ===== ROLE SELECT ===== */}
            <div className="role-radio">
              {userData.roles.map((role) => (
                <label key={role}>
                  <input
                    type="radio"
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role)}
                  />
                  {role}
                </label>
              ))}
            </div>

            {/* ===== ADD ROLE BUTTON ===== */}
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

          {/* ================= ADD ROLE FORM ================= */}
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

          {/* ================= PERMISSIONS ================= */}
          <div className="Action_group">
            <ActionGroup
              title={`Quyền của role ${selectedRole}`}
              actions={permissions}
            />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default PermissionPage;
