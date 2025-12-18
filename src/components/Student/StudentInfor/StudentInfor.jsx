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

registerLocale("vi", vi);

function StudentInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [studentInfo, setStudentInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const data = await getStudentInfo(user.id);
        setStudentInfo(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.id) fetchStudentInfo();
  }, [user?.id]);

  /* ===================== VALIDATION ===================== */
  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      if (!value.trim()) errorMsg = "Email không được để trống.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        errorMsg = "Email không hợp lệ.";
    }

    if (name === "phone") {
      if (!value.trim()) errorMsg = "Số điện thoại không được để trống.";
      else if (/\s/.test(value))
        errorMsg = "Số điện thoại không được chứa khoảng trắng.";
      else if (!/^0\d{9}$/.test(value))
        errorMsg = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
    }

    if (name === "contact_address" && !value.trim()) {
      errorMsg = "Địa chỉ không được để trống.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  const validateAllFields = () => {
    const fields = ["email", "phone", "contact_address"];
    return fields.every((field) =>
      validateField(field, studentInfo[field] || "")
    );
  };

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setStudentInfo((prev) => ({ ...prev, date_of_birth: date }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setStudentInfo((prev) => ({
        ...prev,
        student_image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!validateAllFields()) {
        alert("Vui lòng kiểm tra và nhập đầy đủ thông tin!");
        return;
      }

      const res = await updateStudentInfo(studentInfo);
      if (res.success) {
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    }
  };

  /* ===================== DATE PICKER ===================== */
  const ReadOnlyInput = forwardRef(({ value, onClick }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      className="infor-date-picker"
    />
  ));

  if (!studentInfo) return <p>Đang tải thông tin sinh viên...</p>;

  /* ===================== UI ===================== */
  return (
    <div className="student-info-background">
      <div className="student-info-container">
        <h2 className="title">Thông tin sinh viên</h2>

        <div className="student-info-content">
          {/* ===== ẢNH ===== */}
          <div className="student-photo">
            <input
              type="file"
              id="photo-upload"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="photo-upload" className="photo-upload-label">
              <img
                src={previewImage || studentInfo.student_image || student_pic}
                alt="Student"
                className="photo-box"
              />
              <p className="change-photo-text">Thay ảnh</p>
            </label>
          </div>

          {/* ===== THÔNG TIN ===== */}
          <div className="student-details">
            <h3 className="student-name">{studentInfo.full_name}</h3>

            <div className="info-row">
              <label>MSSV</label>
              <input value={studentInfo.student_number} readOnly />
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

            <div className="info-row">
              <label>Lớp</label>
              <input value={studentInfo.class_id?.name || ""} readOnly />
            </div>

            <div className="info-row">
              <label>Khoa</label>
              <input value={studentInfo.falcuty_name || ""} readOnly />
            </div>

            {/* EMAIL */}
            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input
                  name="email"
                  value={studentInfo.email || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                />
                {errors.email && (
                  <p className="error-text">{errors.email}</p>
                )}
              </div>
            </div>

            {/* PHONE */}
            <div className="info-row">
              <label>Số điện thoại</label>
              <div className="input-column">
                <input
                  name="phone"
                  value={studentInfo.phone || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && (
                  <p className="error-text">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="info-row">
              <label>Địa chỉ</label>
              <div className="input-column">
                <input
                  name="contact_address"
                  value={studentInfo.contact_address || ""}
                  onChange={handleChange}
                  onBlur={(e) =>
                    validateField("contact_address", e.target.value)
                  }
                />
                {errors.contact_address && (
                  <p className="error-text">{errors.contact_address}</p>
                )}
              </div>
            </div>

            {/* STAFF */}
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
                    name="position"
                    value={studentInfo.position || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* ACTION */}
            {user?.roles?.[0]?.role === "student" && (
              <button className="save-btn" onClick={handleSave}>
                Lưu thông tin
              </button>
            )}

            {user?.roles?.[0]?.role === "admin" && (
              <button
                className="save-btn delete-btn"
                onClick={async () => {
                  if (window.confirm("Bạn chắc chắn muốn xóa tài khoản?")) {
                    try {
                      await deleteStudentProfile(studentInfo.id);
                      alert("Đã xóa tài khoản!");
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
