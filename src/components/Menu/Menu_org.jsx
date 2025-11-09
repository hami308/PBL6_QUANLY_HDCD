import "./top_bar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { get_user_permissions } from "../../services/Permission_Service";

const DEFAULT_MENU = [
  { label: "Trang chủ", href: "/home-student", requiredPer: null },
  { label: "Thông tin tổ chức", href: "/org-info", requiredPer: "org_unit:read" },
  { label: "Đề xuất hoạt động", href: "/propose-activity", requiredPer: "activity:create" },
  { label: "Quản lý hoạt động", href: "/manage-activity", requiredPer: "activity:approve" },
  { label: "Tạo mã điểm danh", href: "/create-attendance", requiredPer: "attendance:scan" },
];

export default function TopMenu() {
  const [otherData, setOtherData] = useState([]);
  const [openOther, setOpenOther] = useState(false);
  const otherRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Lấy permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user?.id) return;

        const result = await get_user_permissions(user.id);
        if (!result.success) return;

        const perms = result.data.permissions || {};
        const userPerms = Object.entries(perms).flatMap(([module, actions]) =>
          actions.map(action => `${module}:${action}`.toLowerCase())
        );

        const defaultPerms = DEFAULT_MENU.map(item => item.requiredPer)
          .filter(Boolean)
          .map(p => p.toLowerCase());

        const filtered = userPerms.filter(p => !defaultPerms.includes(p));
        setOtherData(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPermissions();
  }, []);

  // Hover / click
  const handleMouseEnter = () => {
    if (!isTouchDevice()) {
      clearTimeout(closeTimeoutRef.current);
      setOpenOther(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isTouchDevice()) {
      closeTimeoutRef.current = setTimeout(() => setOpenOther(false), 200);
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/"); // redirect về login
  };

  return (
    <div className="top-bar">
      <nav className="header-right">
        {/* Menu chính */}
        {DEFAULT_MENU.map((item, idx) => (
          <a key={idx} href={item.href}>{item.label}</a>
        ))}

        {/* Menu "Khác" */}
        {otherData.length > 0 && (
          <div
            className="profile-dropdown"
            ref={otherRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="profile-btn"
              onClick={() => {
                if (isTouchDevice()) setOpenOther(prev => !prev);
              }}
            >
              Khác
            </button>

            {openOther && (
              <div
                className="dropdown-menu"
                onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
                onMouseLeave={() =>
                  (closeTimeoutRef.current = setTimeout(() => setOpenOther(false), 200))
                }
              >
                {otherData.map((perm, idx) => (
                  <a key={idx} href="#">{perm}</a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Icon thông báo */}
        <a href="/receive-notification" className="icon-link">
          <span className="material-symbols-outlined">notifications</span>
        </a>

        {/* Nút Thoát */}
        <button className="logout-btn" onClick={handleLogout}>
          Thoát
        </button>
      </nav>
    </div>
  );
}
