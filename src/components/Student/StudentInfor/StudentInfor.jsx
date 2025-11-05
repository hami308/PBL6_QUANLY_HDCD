import "./StudentInfor.css";
import student_pic from "../../../assets/images/student_pic.jpg";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import {
  getStudentInfo,
  updateStudentInfo,
  deleteStudentProfile,
} from "../../../services/Student/StudentInfor_Services.js";
import { org } from "../../../data/org.js";

registerLocale("vi", vi);

function StudentInfo() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const user = JSON.parse(sessionStorage.getItem("user"));
  // Lấy thông tin sinh viên
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const data = await getStudentInfo(user.id);
        setStudentInfo(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentInfo();
  }, [user?.id]);

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) errorMsg = "Email không hợp lệ.";
    }

    if (name === "phone") {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(value))
        errorMsg = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setStudentInfo((prev) => ({ ...prev, date_of_birth: date }));
  };

  //  Lưu thông tin sinh viên
  const handleSave = async () => {
    try {
      await updateStudentInfo(studentInfo);
      alert("Cập nhật thông tin thành công!");
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
              <div className="photo-overlay">Thay ảnh</div>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const previewURL = URL.createObjectURL(file);
                  setStudentInfo((prev) => ({
                    ...prev,
                    photo: previewURL, // ảnh hiển thị
                    photoFile: file,   // lưu file để upload
                  }));
                }
              }}
            />
          </div>


          {/* Cột thông tin */}
          <div className="student-details">
            <h3 className="student-name">{studentInfo.full_name}</h3>

            <div className="info-row">
              <label>MSSV</label>
              <input
                type="text"
                name="studentNumber"
                value={studentInfo.student_number}
                readOnly
              />
            </div>

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
                className="infor-date-picker"
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
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="info-row">
              <label>Lớp</label>
              <input
                type="text"
                name="class"
                value={studentInfo.class_id?.name || ""}
                readOnly
              />
            </div>

            <div className="info-row">
              <label>Khoa</label>
              <input
                type="text"
                name="faculty"
                value={studentInfo.faculty?.name || ""}
                readOnly
              />
            </div>

            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input
                  type="email"
                  name="email"
                  value={studentInfo.email || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>

            <div className="info-row">
              <label>Số điện thoại</label>
              <div className="input-column">
                <input
                  type="text"
                  name="phone"
                  value={studentInfo.phone || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            <div className="info-row">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={studentInfo.contact_address || ""}
                onChange={handleChange}
              />
            </div>
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

            {user?.roles?.[0]?.role === "student" && (
              <button className="save-student-infor-btn" onClick={handleSave}>
                Lưu thông tin
              </button>
            )}

            {user?.roles?.[0]?.role === "admin" && (
              <button
                className="save-btn delete-btn"
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
  );
}

export default StudentInfo;
