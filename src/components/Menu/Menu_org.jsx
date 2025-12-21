import "./top_bar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { get_user_permissions } from "../../services/Permission_Service";

// --- MENU MẶC ĐỊNH ---
const DEFAULT_MENU = [
  {
    label: "Quản lý hoạt động",
    href: "/manage-activity-org",
    requiredPer: ["activity:read", "activity:update", "activity_eligibility", "post"],
  },
  { label: "Thông tin tổ chức", href: "/org-infor", requiredPer: "org_unit" },
  {
    label: "Đề xuất hoạt động",
    href: "/propose-activity",
    requiredPer: ["activity:propose", "activity:create", "activity_eligibility:create"],
  },
  { label: "Tạo mã điểm danh", href: "/create-qr-attendance", requiredPer: "attendance:scan" },
];

// --- QUYỀN KHÁC ---
const OTHER_LABELS = [
  { code: "evidence:approve", label: "Duyệt minh chứng" },
  { code: "activity:approve", label: "Duyệt hoạt động" },
  { code: "pvcd_record:read", label: "Xem thống kê điểm PVCD" },
  { code: "faculty:read", label: "Quản lý khoa" },
];

export default function TopMenu() {
  const [menuData, setMenuData] = useState(DEFAULT_MENU);
  const [otherData, setOtherData] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [openOther, setOpenOther] = useState(false);
  const [profilePos, setProfilePos] = useState({ top: 0, left: 0 });
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const otherRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation(); // <--- để detect route change

  // Kiểm tra thiết bị cảm ứng
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Lấy user từ sessionStorage
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Load permissions mỗi khi user hoặc route thay đổi
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user?.id) return;

      try {
        let userPerms = [];
        const cached = sessionStorage.getItem("user_permissions");
        if (cached) {
          userPerms = JSON.parse(cached);
        } else {
          const result = await get_user_permissions(user.id);
          if (!result.success) return;

          const perms = result.data.permissions || {};
          userPerms = Object.entries(perms).flatMap(([module, actions]) =>
            actions.map((a) => ({
              code: `${module}:${a.action_code.toLowerCase()}`,
              name: a.action_name,
            }))
          );
          sessionStorage.setItem("user_permissions", JSON.stringify(userPerms));
        }

        // Update menu chính theo quyền
        const newMenu = DEFAULT_MENU.map((item) => {
          const req = Array.isArray(item.requiredPer) ? item.requiredPer : [item.requiredPer];
          if (req.includes("activity:create")) {
            return userPerms.some((p) => p.code === "activity:create")
              ? { ...item, label: "Tạo hoạt động", href: "/create-activity" }
              : { ...item, label: "Đề xuất hoạt động", href: "/propose-activity" };
          }
          return item;
        });
        setMenuData(newMenu);

        // Lọc dropdown "Khác"
        const otherList = OTHER_LABELS.filter((item) =>
          userPerms.some((p) => p.code === item.code)
        );
        setOtherData(otherList);
      } catch (err) {
        console.error("Error fetching permissions:", err);
      }
    };

    fetchPermissions();
  }, [user, location]); // <-- chạy lại khi route thay đổi

  // Cập nhật vị trí dropdown
  const updateProfilePos = () => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setProfilePos({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
    }
  };
  const updateDropdownPos = () => {
    if (otherRef.current) {
      const rect = otherRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
    }
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!profileRef.current?.contains(e.target) && !otherRef.current?.contains(e.target)) {
        setOpenProfile(false);
        setOpenOther(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Đóng dropdown khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setOpenProfile(false);
      setOpenOther(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (type) => {
    clearTimeout(closeTimeoutRef.current);
    if (type === "profile") {
      setOpenProfile(true);
      updateProfilePos();
    } else {
      setOpenOther(true);
      updateDropdownPos();
    }
  };

  const handleMouseLeave = (type) => {
    closeTimeoutRef.current = setTimeout(() => {
      if (type === "profile") setOpenProfile(false);
      else setOpenOther(false);
    }, 150);
  };

  const handleClick = (type) => {
    if (!isTouch) return;
    if (type === "profile") setOpenProfile((prev) => !prev);
    else setOpenOther((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="top-bar">
      <nav className="header-right">
        {/* Menu chính */}
        {menuData.map((item, idx) => (
          <a key={idx} href={item.href}>
            {item.label}
          </a>
        ))}

        {/* Dropdown "Cá nhân" */}
        <div
          ref={profileRef}
          className="profile-dropdown"
          onMouseEnter={() => handleMouseEnter("profile")}
          onMouseLeave={() => handleMouseLeave("profile")}
        >
          <button className="profile-btn" onClick={() => handleClick("profile")}>
            Cá nhân
          </button>
          {openProfile && (
            <div
              className="dropdown-menu"
              style={{
                position: "fixed",
                top: profilePos.top,
                left: profilePos.left,
                transform: "translateX(-50%)",
                zIndex: 9999,
                minWidth: "180px",
              }}
            >
              {user?.id ? (
                <>
                  <a
                    href={
                      user.roles?.some((r) => r.role === "student")
                        ? `/student-infor/${user.id}`
                        : `/staff-infor/${user.id}`
                    }
                  >
                    Thông tin cá nhân
                  </a>
                  <a href="/change-password">Đổi mật khẩu</a>
                </>
              ) : (
                <p>Đang tải...</p>
              )}
            </div>
          )}
        </div>

        {/* Thông báo */}
        <a href="/receive-notification" className="icon-link">
          <span className="material-symbols-outlined">notifications</span>
        </a>

        {/* Dropdown "Khác" */}
        {otherData.length > 0 && (
          <div
            ref={otherRef}
            className="profile-dropdown"
            onMouseEnter={() => handleMouseEnter("other")}
            onMouseLeave={() => handleMouseLeave("other")}
          >
            <button className="profile-btn" onClick={() => handleClick("other")}>
              Khác
            </button>
            {openOther && (
              <div
                className="dropdown-menu"
                style={{
                  position: "fixed",
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  transform: "translateX(-50%)",
                  zIndex: 9999,
                  minWidth: "180px",
                }}
              >
                {otherData.map((p) => {
                  let href = "#";
                  if (p.code === "evidence:approve") href = "/approved-evidence";
                  else if (p.code === "activity:approve") href = "/activity-approved";
                  else if (p.code === "pvcd_record:read") href = "/statistical/Score";
                  else if (p.code === "faculty:read") href = "/manage-faculty";

                  return (
                    <a key={p.code} href={href}>
                      {p.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          Thoát
        </button>
      </nav>
    </div>
  );
}
