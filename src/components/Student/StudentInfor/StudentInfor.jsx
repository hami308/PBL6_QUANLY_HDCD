import "./StudentInfor.css";
import student_pic from "../../../assets/images/student_pic.jpg";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi"; // Locale tiếng Việt
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
// import { getStudentInfo, updateStudentInfo } from "../../../services/Student/StudentInfor.js";
import {org} from "../../../data/org.js";

registerLocale("vi", vi);

function StudentInfo() {
  // Dữ liệu sinh viên ban đầu
  const initialStudentInfo = {
    mssv: "102200123",
    name: "Nguyễn Thị B",
    dateOfBirth: new Date(2002, 4, 24), // tháng bắt đầu từ 0
    gender: "Nữ",
    class: "20TCLC_DT2",
    faculty: "Khoa Điện tử viễn thông",
    email: "nguyenvana@dut.udn.vn",
    phone: "0912345678",
    address: "123 Nguyễn Văn Linh, Đà Nẵng",
    unit: "Liên chi đoàn khoa Điện",
    position: "Bí thư",
  };
  //lấy thông tin sinh viên

    // useEffect(() => {
    //   const fetchStudentInfo = async () => {
    //     try {
    //       const data = await getStudentInfo("102200123"); // ví dụ: mã số sinh viên
    //       setStudentInfo(data);
    //     } catch (error) {
    //       alert("Không thể tải thông tin sinh viên!");
    //     }
    //   };
    //   fetchStudentInfo();
    // }, []);
      // Tạo state để quản lý dữ liệu


  const [studentInfo, setStudentInfo] = useState(initialStudentInfo);

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  //kiểm tra định dạng email và số điện thoại
  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Email không hợp lệ.";
      }
    }

    if (name === "phone") {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(value)) {
        errorMsg = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0";
      }
    }

    // Cập nhật lỗi tương ứng
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };
  // Hàm xử lý thay đổi input text/email/phone...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý thay đổi ngày sinh
  const handleDateChange = (date) => {
    setStudentInfo((prev) => ({
      ...prev,
      dateOfBirth: date,
    }));
  };

  // Hàm lưu thông tin (tạm thời chỉ console.log)
  const handleSave = () => {
    console.log("Thông tin sinh viên đã lưu:", studentInfo);
    alert("Đã lưu thông tin sinh viên!");
  };
//   const handleSave = async () => {
  //   try {
  //     await updateStudentInfo(studentInfo);
  //     alert(" Cập nhật thông tin thành công!");
  //   } catch (error) {
  //     alert(" Lỗi khi cập nhật thông tin. Vui lòng thử lại!");
  //   }
  // };

  return (
    <div className="student-info-background">
      <div className="student-info-container">
        <h2 className="title">Thông tin sinh viên</h2>

        <div className="student-info-content">
          {/* Cột ảnh */}
          <div className="student-photo">
            <img src={student_pic} alt="Student" className="photo-box" />
          </div>

          {/* Cột thông tin */}
          <div className="student-details">
            <h3 className="student-name">{studentInfo.name}</h3>

            <div className="info-row">
              <label>MSSV</label>
              <input
                type="text"
                name="mssv"
                value={studentInfo.mssv}
                readOnly
              />
            </div>

            <div className="info-row">
              <label>Ngày sinh</label>
              <DatePicker
                selected={studentInfo.dateOfBirth}
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
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="info-row">
              <label>Lớp</label>
              <input
                type="text"
                name="class"
                value={studentInfo.class}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="info-row">
              <label>Khoa</label>
              <input
                type="text"
                name="faculty"
                value={studentInfo.faculty}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input
                  type="email"
                  name="email"
                  value={studentInfo.email}
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
                  value={studentInfo.phone}
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
                value={studentInfo.address}
                onChange={handleChange}
              />
            </div>

            <div className="info-row">
              <label>Thuộc đơn vị</label>
              <select
                name="unit"
                value={studentInfo.unit}
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
                value={studentInfo.position}
                onChange={handleChange}
              />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentInfo;
