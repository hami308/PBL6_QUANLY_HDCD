// Menu_guest.jsx
import "./top_bar.css";
import { useContext } from "react";
import { LoginContext } from "../Login/LoginContext.jsx";

function Menu_guest() {
  const { openLogin } = useContext(LoginContext);

  return (
    <div className="top-bar">
      <nav className="header-right">
        <a href="/">Trang chủ</a>
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            openLogin();
          }}
        >
          Đăng nhập
        </a>
      </nav>
    </div>
  );
}

export default Menu_guest;
