import "./top_bar.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentInfo } from "../../services/Student/StudentInfor_Services";
import { logout } from "../../services/Login_Service/Login_Service"; 

function Menu_student() {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const btnRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"));

  // ================== FETCH STUDENT INFO ==================
  useEffect(() => {
    if (!user) return;

    const fetchStudentInfo = async () => {
      try {
        const data = await getStudentInfo(user.id);
        if (data?._id) {
          sessionStorage.setItem("student_id", data._id);
        }
        
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sinh viên:", error);
      }
    };

    fetchStudentInfo();
  }, [user]);

  // ================== LOGOUT ==================
  const handleLogout = () => {
    logout(); 
    navigate("/", { replace: true });
  };

  // ================== DROPDOWN POSITION ==================
  const updateDropdownPos = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 2,
      left: rect.left + rect.width / 2,
    });
  };

  // update position when open / resize / scroll
  useEffect(() => {
    if (!openProfile) return;

    updateDropdownPos();
    const handleResizeScroll = () => updateDropdownPos();

    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll);

    return () => {
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [openProfile]);

  // close when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        !document.querySelector(".dropdown-menu")?.contains(e.target)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ================== DEVICE CHECK ==================
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const handleMouseEnter = () => {
    if (!isTouchDevice()) {
      clearTimeout(closeTimeoutRef.current);
      setOpenProfile(true);
      updateDropdownPos();
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice()) {
      closeTimeoutRef.current = setTimeout(
        () => setOpenProfile(false),
        250
      );
    }
  };

  // ================== JSX ==================
  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/home-student">Trang chủ</a>
        <a href="/manage-activities-student">Quản lý hoạt động</a>

        <div
          className="profile-dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            ref={btnRef}
            className="profile-btn"
            onClick={() => {
              if (isTouchDevice()) {
                setOpenProfile((prev) => !prev);
                updateDropdownPos();
              }
            }}
          >
            Cá nhân
          </button>
        </div>

        <a href="/receive-notification" className="icon-link">
          <span className="material-symbols-outlined">notifications</span>
        </a>

        <button onClick={handleLogout} className="logout-btn">
          Thoát
        </button>
      </nav>

      {/* ================== DROPDOWN ================== */}
      {openProfile && (
        <div
          className="dropdown-menu"
          onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
          onMouseLeave={() =>
            (closeTimeoutRef.current = setTimeout(
              () => setOpenProfile(false),
              250
            ))
          }
          style={{
            position: "fixed",
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {user && <a href={`/student-infor/${user.id}`}>Thông tin cá nhân</a>}
          <a href="/pvcd-record">Kết quả phục vụ cộng đồng</a>
          <a
            href="/submit-evidence"
            onClick={() =>
              sessionStorage.setItem("previousPage", "/submit-evidence")
            }
          >
            Nộp minh chứng ngoài trường
          </a>
          <a href="/change-password">Đổi mật khẩu</a>
        </div>
      )}
    </div>
  );
}

export default Menu_student;
