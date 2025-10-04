import logo from '../../assets/images/logo_dut.jpg';
import './Header.css';
function Header() {
  return (
    <header className="header">
        <div className="header-container">
            <div className="logo">
            <img src={logo} alt="Logo"/>
            </div>
            <div className="system-name">
            <h1>Hệ thống quản lý hoạt động cộng đồng</h1>
            <p>Community Activity Management System</p>
            </div>
        </div>
    </header>

  );
}
export default Header;
