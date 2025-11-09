import "./top_bar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { get_user_permissions } from "../../services/Permission_Service";

const DEFAULT_MENU = [
  { label: "Trang chủ", href: "/home-student", requiredPer: null },
  { label: "Thông tin tổ chức", href: "/org-infor", requiredPer: "org_unit:read" },
  // chỗ này sẽ thay đổi label & href theo quyền
  { label: "Đề xuất hoạt động", href: "/propose-activity", requiredPer: "activity:create" },
  { label: "Quản lý hoạt động", href: "/manage-activity-org", requiredPer: "activity:approve" },
  { label: "Tạo mã điểm danh", href: "/create-attendance", requiredPer: "attendance:scan" },
];

export default function TopMenu() {
  const [menuData, setMenuData] = useState(DEFAULT_MENU);
  const [otherData, setOtherData] = useState([]);
  const [openOther, setOpenOther] = useState(false);
  const otherRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const cached = sessionStorage.getItem("user_permissions");
        let userPerms = [];

        if (cached) {
          userPerms = JSON.parse(cached);
        } else {
          const user = JSON.parse(sessionStorage.getItem("user"));
          if (!user?.id) return;

          const result = await get_user_permissions(user.id);
          if (!result.success) return;

          const perms = result.data.permissions || {};
          userPerms = Object.entries(perms).flatMap(([module, actions]) =>
            actions.map((a) => `${module}:${a}`.toLowerCase())
          );

          sessionStorage.setItem("user_permissions", JSON.stringify(userPerms));
        }

        // ✅ Nếu có quyền activity:create => đổi label & href
        const newMenu = DEFAULT_MENU.map((item) => {
          if (item.requiredPer === "activity:create") {
            if (userPerms.includes("activity:create")) {
              return { ...item, label: "Tạo hoạt động", href: "/create-activity" };
            } else {
              return { ...item, label: "Đề xuất hoạt động", href: "/propose-activity" };
            }
          }
          return item;
        });

        setMenuData(newMenu);

        // Tạo danh sách "Khác"
        const defaultPerms = DEFAULT_MENU.map((i) => i.requiredPer)
          .filter(Boolean)
          .map((p) => p.toLowerCase());
        const filtered = userPerms.filter((p) => !defaultPerms.includes(p));
        setOtherData(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPermissions();
  }, []);

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

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("user_permissions");
    navigate("/");
  };

  return (
    <div className="top-bar">
      <nav className="header-right">
        {menuData.map((item, idx) => (
          <a key={idx} href={item.href}>
            {item.label}
          </a>
        ))}

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
                if (isTouchDevice()) setOpenOther((prev) => !prev);
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
                  <a key={idx} href="#">
                    {perm}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <a href="/receive-notification" className="icon-link">
          <span className="material-symbols-outlined">notifications</span>
        </a>

        <button className="logout-btn" onClick={handleLogout}>
          Thoát
        </button>
      </nav>
    </div>
  );
}
