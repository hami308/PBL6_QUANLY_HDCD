import { useEffect, useState } from "react";
import "./CreateAccountBox.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { get_all_faculties } from "../../../services/Faculty_Service";
import {getClass} from "../../../services/Class_Service";
import { get_all_org } from "../../../services/Org_Service";
import { LiaSymfony } from "react-icons/lia";
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

  const [listFaculty, setListFaculty] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculties = async () => {
      const response = await get_all_faculties();
      console.log("faculty", response);
      if (response.data) {
        setListFaculty(response.data);
      } else {
        console.log("Error : ", response.message);
        return [];
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (faculty) {
        const listClasses = await getClass(faculty);
        console.log("Classes response:", listClasses);
        if (listClasses.data) {
          setClassName(listClasses.data);
        } else {
          console.error("Failed to fetch classes:", listClasses.message);
        }
      } else {
        setClassName("");
      }
    };
    fetchClasses();
  }, [faculty]);

  useEffect(() => {
    const fetchOrg = async () => {
      const response = await get_all_org();
      console.log("Org response:", response);
      if (response.data) {
        setOrgList(response.data);
      } else {
        console.error("Failed to fetch faculties:", response.message);
        return [];
      }
    };
    fetchOrg();
  }, []);

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
      <h2 className="form-title">Tạo tài khoản mới</h2>

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
            <label>Khoa</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn khoa --
              </option>
              {listFaculty.length > 0 ? (
                listFaculty.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Trống
                </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Lớp</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="" disabled>
                Lớp
              </option>
              {className.length > 0 ? (
                className.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Trống
                </option>
              )}
            </select>
          </div>
        </>
      )}

      {/* Dynamic fields for Organization */}
      {role === "organization" && (
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
                Đơn vị công tác
              </option>
              {orgList.length > 0 ? (
                orgList.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading
                </option>
              )}
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
