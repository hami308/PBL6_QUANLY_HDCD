import "./StudentInfor.css";
import student_pic from "../../../assets/images/student_pic.jpg";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect, forwardRef } from "react";
import {
  getStudentInfo,
  updateStudentInfo,
  deleteStudentProfile,
} from "../../../services/Student/StudentInfor_Services.js";
import { org } from "../../../data/org.js";
import { get_all_faculties } from "../../../services/Faculty_Service";
import getClass from "../../../services/Class_Service";
registerLocale("vi", vi);

function StudentInfo({ idstudent }) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [facultyList, setFacultyList] = useState([]);
  const [idfaculty, setIdFaculty] = useState("");

  const [classList, setClassList] = useState([]); // ✅ danh sách lớp
  const [selectedClass, setSelectedClass] = useState(""); // ✅ lớp được chọn

  // Lấy thông tin sinh viên
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const data = await getStudentInfo(idstudent);
        setStudentInfo(data);
        setIdFaculty(data.class_id.falcuty_id._id);
        setSelectedClass(data.class_id._id);
        console.log("dữ liệu sinh viên ", data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentInfo();
  }, [idstudent]);

  // --- Fetch faculty list ---
  useEffect(() => {
    const fetchFaculties = async () => {
      const response = await get_all_faculties();
      console.log("dữ liệu khoa ", response);
      if (response.data) {
        setFacultyList(response.data);
      } else {
        console.error("Failed to fetch faculties:", response.message);
      }
    };
    fetchFaculties();
  }, []);

  // --- Fetch classes theo khoa ---
  useEffect(() => {
    const fetchClasses = async () => {
      if (idfaculty) {
        const res = await getClass(idfaculty);
        console.log("dữ liệu lớp ", res);
        if (res.data) {
          setClassList(res.data);
        } else {
          console.error("Failed to fetch classes:", res.message);
        }
      } else {
        setClassList([]);
        setSelectedClass("");
      }
    };
    fetchClasses();
  }, [idfaculty]);

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      if (!value.trim()) {
        errorMsg = "Email không được để trống.";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errorMsg = "Email không hợp lệ.";
      }
    }

    if (name === "phone") {
      if (!value.trim()) {
        errorMsg = "Số điện thoại không được để trống.";
      } else if (/\s/.test(value)) {
        errorMsg = "Số điện thoại không được chứa khoảng trắng.";
      } else {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(value)) {
          errorMsg = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
        }
      }
    }

    if (name === "contact_address") {
      if (!value.trim()) errorMsg = "Địa chỉ không được để trống.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setStudentInfo((prev) => ({ ...prev, date_of_birth: date }));
  };

  const ReadOnlyInput = forwardRef(({ value, onClick }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      className="infor-date-picker"
    />
  ));

  // Hàm kiểm tra tất cả các trường trước khi lưu
  const validateAllFields = () => {
    const fieldsToCheck = ["email", "phone", "contact_address"];
    let isValid = true;
    fieldsToCheck.forEach((field) => {
      const value = studentInfo[field] || "";
      const valid = validateField(field, value);
      if (!valid) isValid = false;
    });
    return isValid;
  };

  //  Lưu thông tin sinh viên
  const handleSave = async () => {
    try {
      const isValid = validateAllFields();

      // Nếu có lỗi hoặc trường trống thì không cho lưu
      if (!isValid) {
        alert("Vui lòng kiểm tra và nhập đầy đủ thông tin trước khi lưu!");
        return;
      }

      const status = await updateStudentInfo(studentInfo);
      console.log("Thông tin sinh viên đem đi cập nhật ", studentInfo);
      if (status.success) {
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin. Vui lòng thử lại!");
    }
  };

  if (!studentInfo) return <p>Đang tải thông tin sinh viên...</p>;

  return (
    <div className="student-info-background">
      <div className="student-info-container">
        <h2 className="title">Thông tin sinh viên</h2>
        <div className="student-info-content">
          {/* Cột ảnh */}
          <div className="student-photo">
            <label htmlFor="photo-upload" className="photo-upload-label">
              <img
                src={studentInfo.photo || student_pic}
                alt="Student"
                className="photo-box"
              />
            </label>
          </div>

          {/* Cột thông tin */}
          <div className="student-details">
            <h3 className="student-name">{studentInfo.full_name}</h3>
            {user?.roles?.[0]?.role === "admin" ? (
              <div className="info-row">
                <label>MSSV</label>
                <input
                  type="text"
                  name="student_number"
                  value={studentInfo.student_number}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="info-row">
                <label>MSSV</label>
                <input
                  type="text"
                  name="studentNumber"
                  value={studentInfo.student_number}
                  readOnly
                />
              </div>
            )}

            <div className="info-row">
              <label>Ngày sinh</label>
              <DatePicker
                selected={studentInfo.date_of_birth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale="vi"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={<ReadOnlyInput />}
              />
            </div>

            <div className="info-row">
              <label>Giới tính</label>
              <select
                name="gender"
                value={studentInfo.gender}
                onChange={handleChange}
                className="infor-select"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
            {user?.roles?.[0]?.role === "admin" ? (
              <div className="info-row">
                <label>Khoa</label>
                <select
                  value={idfaculty}
                  onChange={(e) => {
                    setIdFaculty(e.target.value); // cập nhật khoa để fetch lớp
                    setStudentInfo((prev) => ({
                      ...prev,
                      class_id: {
                        ...prev.class_id,
                        falcuty_id: { _id: e.target.value },
                      },
                    }));
                  }}
                  className="infor-select"
                >
                  <option value="">Khoa</option>
                  {facultyList.map((fac) => (
                    <option key={fac._id} value={fac._id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="info-row">
                <label>Khoa</label>
                <input
                  type="text"
                  value={studentInfo.falcuty_name || ""}
                  readOnly
                />
              </div>
            )}
            {user?.roles?.[0]?.role === "admin" ? (
              <div className="info-row">
                <label>Lớp</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudentInfo((prev) => ({
                      ...prev,
                      class_id: { ...prev.class_id, _id: e.target.value },
                    }));
                  }}
                  className="infor-select"
                >
                  <option value="">Lớp</option>
                  {classList.length > 0 ? (
                    classList.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Trống</option>
                  )}
                </select>
              </div>
            ) : (
              <div className="info-row">
                <label>Lớp</label>
                <input
                  type="text"
                  value={studentInfo.class_id?.name || ""}
                  readOnly
                />
              </div>
            )}

            {/* Email */}
            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input
                  type="email"
                  name="email"
                  value={studentInfo.email || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                  required
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="info-row">
              <label>Số điện thoại</label>
              <div className="input-column">
                <input
                  type="text"
                  name="phone"
                  value={studentInfo.phone || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("phone", e.target.value)}
                  required
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="info-row">
              <label>Địa chỉ</label>
              <div className="input-column">
                <input
                  type="text"
                  name="contact_address"
                  value={studentInfo.contact_address || ""}
                  onChange={handleChange}
                  onBlur={(e) =>
                    validateField("contact_address", e.target.value)
                  }
                  required
                />
                {errors.contact_address && (
                  <p className="error-text">{errors.contact_address}</p>
                )}
              </div>
            </div>

            {/* Nếu là staff */}
            {user?.roles?.[0]?.role === "staff" && (
              <>
                <div className="info-row">
                  <label>Thuộc đơn vị</label>
                  <select
                    name="unit"
                    value={studentInfo.unit || ""}
                    onChange={handleChange}
                    className="infor-select"
                  >
                    {org.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="info-row">
                  <label>Chức vụ</label>
                  <input
                    type="text"
                    name="position"
                    value={studentInfo.position || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div className="action-buttons">
              {/* Nếu là student */}
              {(user?.roles?.[0]?.role === "student" ||
                user?.roles?.[0]?.role === "admin") && (
                <button className="save-student-infor-btn" onClick={handleSave}>
                  Lưu thông tin
                </button>
              )}

              {/* Nếu là admin */}
              {user?.roles?.[0]?.role === "admin" && (
                <button
                  className="delete-btn-student"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Bạn có chắc chắn muốn xóa tài khoản này không?"
                    );
                    if (confirmDelete) {
                      try {
                        await deleteStudentProfile(studentInfo.id);
                        alert("Đã xóa tài khoản sinh viên!");
                      } catch {
                        alert("Không thể xóa tài khoản!");
                      }
                    }
                  }}
                >
                  Xóa tài khoản
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentInfo;
