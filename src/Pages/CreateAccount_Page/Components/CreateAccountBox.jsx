import { useEffect, useState } from "react";
import "./CreateAccountBox.css";
import { useNavigate } from "react-router-dom";
import { get_all_faculties } from "../../../services/Faculty_Service";
import { getClassesByFaculty } from "../../../services/Class_Service";
import { get_all_org } from "../../../services/Org_Service";
import {
  createAccount_Student,
  createAccount_Staff,
} from "../../../services/AcccountService/CreateAccountService";
import { get_all_position } from "../../../services/Position_Service";
const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  // Thông tin bổ sung
  const [fullName, setFullName] = useState("");
  const [classId, setClassId] = useState(""); // ID lớp được chọn
  const [faculty, setFaculty] = useState(""); // ID khoa
  const [workUnit, setWorkUnit] = useState("");
  const [position, setPosition] = useState("");

  // Danh sách dữ liệu
  const [listFaculty, setListFaculty] = useState([]);
  const [listClass, setListClass] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [positionList, setPositionList] = useState([]);

  const navigate = useNavigate();

  // Lấy danh sách khoa
  useEffect(() => {
    const fetchFaculties = async () => {
      const response = await get_all_faculties();
      if (response.data) {
        setListFaculty(response.data);
      } else {
        console.error("Error:", response.message);
      }
    };
    fetchFaculties();
  }, []);

  // Lấy danh sách lớp theo khoa
  useEffect(() => {
    const fetchClasses = async () => {
      if (faculty) {
        const response = await getClassesByFaculty(faculty);
        if (response.data) {
          setListClass(response.data);
        } else {
          console.error("Failed to fetch classes:", response.message);
        }
      } else {
        setListClass([]); // reset nếu chưa chọn khoa
      }
    };
    fetchClasses();
  }, [faculty]);

  //Lấy chức vụ
  useEffect(() => {
    const fetchPositions = async () => {
      const result = await get_all_position();
      console.log(result);
      if (result.success) {
        setPositionList(result.data);
      } else {
        console.error("Lỗi lấy chức vụ:", result.message);
      }
    };

    fetchPositions();
  }, []);

  // Lấy danh sách tổ chức
  useEffect(() => {
    const fetchOrg = async () => {
      const response = await get_all_org();
      if (response.data) {
        setOrgList(response.data);
      } else {
        console.error("Failed to fetch orgs:", response.message);
      }
    };
    fetchOrg();
  }, []);

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (role === "student" && (!fullName || !classId || !faculty)) {
      setMessage("Vui lòng nhập đầy đủ thông tin sinh viên!");
      return;
    }

    if (role === "staff" && (!fullName || !workUnit || !position)) {
      setMessage("Vui lòng nhập đầy đủ thông tin giảng viên!");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage("Bạn cần đăng nhập bằng tài khoản admin để tạo tài khoản!");
      return;
    }

    if (role == "student") {
      try {
        const response = await createAccount_Student({
          username,
          password,
          roleName: role,
          full_name: fullName,
          class_id: classId,
        });
        // console.log(
        //   "Dữ liệu kiểm tra:",
        //   username,
        //   password,
        //   role,
        //   fullName,
        //   classId
        // );

        if (response.success) {
          alert("Tạo tài khoản thành công !");
          setUsername("");
          setPassword("");
          setRole("");
          setFullName("");
          setClassId("");
          setFaculty("");
        } else {
          setMessage(response.message);
        }
      } catch (error) {
        console.error("Lỗi tạo tài khoản:", error);
        setMessage(error.response?.data?.message || "Lỗi khi gọi API!");
      }
    }
    if (role == "staff") {
      try {
        const response = await createAccount_Staff({
          username,
          password,
          roleName: role,
          full_name: fullName,
          org_unit_id: workUnit,
          position,
        });
        console.log(
          "Dữ liệu kiểm tra:",
          username,
          password,
          role,
          fullName,
          classId
        );

        if (response.success) {
          const per = window.confirm(
            "Tạo tài khoản cho cán bộ giảng viên thành công! Bạn có muốn phân quyền không?"
          );
          if (per) {
            navigate("/permission", { state: { username, role } });
          } else {
            setUsername("");
            setPassword("");
            setRole("");
            setFullName("");
            setClassId("");
            setFaculty("");
            setWorkUnit("");
            setPosition("");
          }
        } else {
          setMessage(response.message);
        }
      } catch (error) {
        console.error("Lỗi tạo tài khoản:", error);
        setMessage(error.response?.data?.message || "Lỗi khi gọi API!");
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
      {/* <div className="form-group">
        <label>Mật khẩu</label>
        <input type="password" value={password} disabled />
      </div> */}

      {/* Role */}
      <div className="form-group">
        <label>Vai trò</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="" disabled>
            -- Chọn vai trò --
          </option>
          <option value="student">Sinh viên</option>
          <option value="staff">Tổ chức</option>
        </select>
      </div>

      {/* Sinh viên */}
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
              {listFaculty.map((fac) => (
                <option key={fac._id} value={fac._id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Lớp</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)} // ✅ chọn id lớp
            >
              <option value="" disabled>
                -- Chọn lớp --
              </option>
              {listClass.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Tổ chức */}
      {role === "staff" && (
        <>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên cán bộ /giảng viên"
            />
          </div>

          <div className="form-group">
            <label>Đơn vị công tác</label>
            <select
              value={workUnit}
              onChange={(e) => setWorkUnit(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn đơn vị công tác --
              </option>
              {orgList.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Chức vụ</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn chức vụ --
              </option>
              {positionList.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {message && <p className="error">{message}</p>}

      <div className="submit-btn">
        <button type="submit">
          <span className="material-symbols-outlined">done_outline</span>
        </button>
      </div>
    </form>
  );
};

export default CreateAccount;
