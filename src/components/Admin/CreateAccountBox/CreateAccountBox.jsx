import { useState } from "react";
import "./CreateAccountBox.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  // Thông tin bổ sung theo vai trò
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState(""); // cho sinh viên
  const [faculty, setFaculty] = useState(""); // cho sinh viên
  const [workUnit, setWorkUnit] = useState(""); // cho giảng viên
  const [position, setPosition] = useState(""); // cho giảng viên

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin cơ bản
    if (!username || !password || !role) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra thông tin riêng theo role
    if (role === "student" && (!fullName || !className || !faculty)) {
      setMessage("Vui lòng nhập đầy đủ thông tin sinh viên!");
      return;
    }

    if (role === "teacher" && (!fullName || !workUnit || !position)) {
      setMessage("Vui lòng nhập đầy đủ thông tin giảng viên!");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập bằng tài khoản admin để tạo tài khoản!");
      return;
    }
    try {
      const response = await axios.post(
        "https://pbl6-backend.vercel.app/api/auth/register",
        {
          username,
          password,
          roleName: role,
          fullName,
          className,
          faculty,
          workUnit,
          position,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.data.success) {
        const per = window.confirm(
          "Tạo tài khoản thành công! Bạn có muốn phân quyền hay không?"
        );
        if (per) {
          navigate("/permission", { state: { username, role } });
        } else {
          // Reset form
          setUsername("");
          setPassword("");
          setRole("");
          setFullName("");
          setClassName("");
          setFaculty("");
          setWorkUnit("");
          setPosition("");
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi tạo tài khoản:", error);
      if (error.response) {
        setMessage(error.response.data.message || "Lỗi khi gọi API!");
      } else {
        setMessage("Không thể kết nối tới máy chủ!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-account-form">
      <h2 className="form-title">Tạo 1 tài khoản</h2>

      {/* Username */}
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setPassword(e.target.value);
          }}
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Mật khẩu</label>
        <input type="password" value={password} disabled />
      </div>

      {/* Role */}
      <div className="form-group">
        <label>Vai trò</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="" disabled>
            -- Chọn vai trò --
          </option>
          <option value="student">Sinh viên</option>
          <option value="organization">Tổ chức</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Dynamic fields for Student */}
      {role === "student" && (
        <>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên sinh viên"
            />
          </div>

          <div className="form-group">
            <label>Lớp</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn lớp --
              </option>
              <option value="class1">Lớp 1</option>
              <option value="class2">Lớp 2</option>
              <option value="class3">Lớp 3</option>
            </select>
          </div>

          <div className="form-group">
            <label>Khoa</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn khoa --
              </option>
              <option value="faculty1">Khoa 1</option>
              <option value="faculty2">Khoa 2</option>
              <option value="faculty3">Khoa 3</option>
            </select>
          </div>
        </>
      )}

      {/* Dynamic fields for Teacher */}
      {role === "teacher" && (
        <>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên giảng viên"
            />
          </div>

          <div className="form-group">
            <label>Đơn vị công tác</label>
            <select
              value={workUnit}
              onChange={(e) => setWorkUnit(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn đơn vị --
              </option>
              <option value="unit1">Đơn vị 1</option>
              <option value="unit2">Đơn vị 2</option>
              <option value="unit3">Đơn vị 3</option>
            </select>
          </div>

          <div className="form-group">
            <label>Chức vụ</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Nhập chức vụ"
            />
          </div>
        </>
      )}

      {message && <p className="error">{message}</p>}

      <div className="submit-btn">
        <button type="submit">
          <span className="material-symbols-outlined">done_outline</span>
        </button>
      </div>

      <div className="note">
        <p>Lưu ý:</p>
        <ul>
          <li>
            Tài khoản sinh viên mặc định username và mật khẩu là mã số sinh
            viên.
          </li>
          <li>
            Tài khoản giảng viên mặc định username và mật khẩu là mã số giảng
            viên.
          </li>
          <li>Tài khoản cán bộ mặc định username và mật khẩu là mã cán bộ.</li>
        </ul>
      </div>
    </form>
  );
};

export default CreateAccount;
