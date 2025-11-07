import "./top_bar.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentInfo } from "../../services/Student/StudentInfor_Services";

function Menu_student() {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [isMonitor, setIsMonitor] = useState(false); // lớp trưởng hay không
  const btnRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  //  Gọi API lấy thông tin sinh viên
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
       const data = await getStudentInfo(user.id); // gọi API
        if (data) {
          const info = data;
          setIsMonitor(info.isClassMonitor);
          sessionStorage.setItem("student_id", info._id);
          sessionStorage.setItem("isMonitor", info.isClassMonitor);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sinh viên:", error);
        // fallback: đọc từ sessionStorage nếu có
        const userData = sessionStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setIsMonitor(!!user.isClassMonitor);

        }
      }
    };

    fetchStudentInfo();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  //  Tính vị trí dropdown theo nút "Cá nhân"
  const updateDropdownPos = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 2,
        left: rect.left + rect.width / 2,
      });
    }
  };

  //  Cập nhật vị trí khi mở menu hoặc resize
  useEffect(() => {
    if (openProfile) updateDropdownPos();
    const handleResizeScroll = () => {
      if (openProfile) updateDropdownPos();
    };
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll);
    return () => {
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [openProfile]);

  //  Tự đóng khi click ra ngoài
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
      closeTimeoutRef.current = setTimeout(() => setOpenProfile(false), 250);
    }
  };

  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/home-student">Trang chủ</a>
        <a href="/attendance">Điểm danh</a>
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

      {/* --- Dropdown cá nhân --- */}
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
          <a href="/student-infor">Thông tin cá nhân</a>
          <a href="/pvcd-record">Kết quả phục vụ cộng đồng</a>
          <a href="/submit-evidence" onClick={() => sessionStorage.setItem("previousPage", "/submit-evidence")}>
            Nộp minh chứng ngoài trường
          </a>
          <a href="/change-password">Đổi mật khẩu</a>

          {/*  Hiện nút này nếu là lớp trưởng */}
          {isMonitor && (
            <a href="/approved-evidence" onClick={() => sessionStorage.setItem("previousPage", "/approved-evidence")}>
              Duyệt minh chứng
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu_student;
