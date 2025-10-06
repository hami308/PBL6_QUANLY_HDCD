import "./TeacherInfor.css";
import teacher_pic from "../../assets/images/teacher_pic.jpg";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { org } from "../../data/org";

registerLocale("vi", vi);

function TeacherInfo() {
  const initialTeacherInfo = {
    id: "GV001",
    name: "Trần Triết Viễn",
    dateOfBirth: new Date(1997, 3, 15),
    gender: "Nam",
    email: "trinhphuong@dut.udn.vn",
    phone: "0912345678",
    address: "456 Lê Duẩn, Đà Nẵng",
    unit: "Khoa Công nghệ Thông tin",
    position: "Trưởng khoa",
  };

  const [teacherInfo, setTeacherInfo] = useState(initialTeacherInfo);

  const [errors, setErrors] = useState({ email: "", phone: "" });

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
    setTeacherInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setTeacherInfo((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleSave = () => {
    console.log("Thông tin giảng viên đã lưu:", teacherInfo);
    alert("Đã lưu thông tin giảng viên!");
  };

  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="teacher-info-background">
      <div className="teacher-info-container">
        <h2 className="title">Thông tin cán bộ / giảng viên</h2>

        {/* Hiển thị chức vụ và đơn vị nổi bật */}
        <div className="teacher-highlight">
          <p className="teacher-position">{teacherInfo.position}</p>
          <p className="teacher-unit">{teacherInfo.unit}</p>
        </div>

        <div className="teacher-info-content">
          {/* Cột ảnh */}
          <div className="teacher-photo">
            <img src={teacher_pic} alt="Teacher" className="photo-box" />
          </div>

          {/* Cột thông tin */}
          <div className="teacher-details">
            <h3 className="teacher-name">{teacherInfo.name}</h3>

            <div className="info-row">
              <label>Mã giảng viên</label>
              <input type="text" name="id" value={teacherInfo.id} readOnly />
            </div>

            <div className="info-row">
              <label>Ngày sinh</label>
              <DatePicker
                selected={teacherInfo.dateOfBirth}
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
                value={teacherInfo.gender}
                onChange={handleChange}
                className="infor-select"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input
                  type="email"
                  name="email"
                  value={teacherInfo.email}
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
                  value={teacherInfo.phone}
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
                value={teacherInfo.address}
                onChange={handleChange}
              />
            </div>

            <div className="info-row">
              <label>Thuộc đơn vị</label>
              <select
                name="unit"
                value={teacherInfo.unit}
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
                value={teacherInfo.position}
                onChange={handleChange}
              />
            </div>

            {user?.role === "teacher" && (
              <button className="save-btn" onClick={handleSave}>
                Lưu thông tin
              </button>
            )}
            {user?.role === "admin" && (
              <button
                className="save-btn"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Bạn có chắc chắn muốn xóa tài khoản này không?"
                  );
                  if (confirmDelete) {
                    // Gọi hàm xóa tài khoản ở đây
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

export default TeacherInfo;
