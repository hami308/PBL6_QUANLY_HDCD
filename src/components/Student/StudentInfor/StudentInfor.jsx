import student_pic from "../../../assets/images/student_pic.jpg";
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect, forwardRef } from "react";
import "../../Teacher/TeacherInfor.css";
import {
  getStudentInfo,
  updateStudentInfo,
  deleteStudentProfile,
} from "../../../services/Student/StudentInfor_Services.js";
import { org } from "../../../data/org.js";

registerLocale("vi", vi);

function StudentInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = sessionStorage.getItem("role");

  const [studentInfo, setStudentInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user?.id) return;
    getStudentInfo(user.id)
      .then(setStudentInfo)
      .catch(console.error);
  }, [user?.id]);

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    let msg = "";

    if (name === "email") {
      if (!value.trim()) msg = "Email không được để trống";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        msg = "Email không hợp lệ";
    }

    if (name === "phone") {
      if (!/^0\d{9}$/.test(value))
        msg = "SĐT phải có 10 số và bắt đầu bằng 0";
    }

    if (name === "contact_address" && !value.trim()) {
      msg = "Địa chỉ không được để trống";
    }

    setErrors((p) => ({ ...p, [name]: msg }));
    return !msg;
  };

  const validateAllFields = () =>
    ["email", "phone", "contact_address"].every((f) =>
      validateField(f, studentInfo[f] || "")
    );

  /* ================= HANDLER ================= */
  const handleChange = (e) =>
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });

  const handleDateChange = (date) =>
    setStudentInfo({ ...studentInfo, date_of_birth: date });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setStudentInfo((p) => ({ ...p, student_image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!validateAllFields()) return alert("Vui lòng kiểm tra dữ liệu!");
    const res = await updateStudentInfo(studentInfo);
    alert(res?.success ? "Cập nhật thành công!" : "Cập nhật thất bại!");
  };

  /* ================= DATE INPUT ================= */
  const ReadOnlyInput = forwardRef(({ value, onClick }, ref) => (
    <input ref={ref} value={value} onClick={onClick} readOnly className="infor-date-picker" />
  ));

  if (!studentInfo)
    return (
      <div className="teacher-info-background">
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="teacher-info-background">
      <div className="teacher-info-container">
        <h2 className="title">Thông tin sinh viên</h2>

        <div className="teacher-info-content">
          {/* ===== PHOTO ===== */}
          <div className="teacher-photo">
            <input type="file" hidden id="upload" accept="image/*" onChange={handleImageChange} />
            <label htmlFor="upload" className="photo-upload-label">
              <img
                src={previewImage || studentInfo.student_image || student_pic}
                className="photo-box"
                alt="student"
              />
              <p className="change-photo-text">Thay ảnh</p>
            </label>
          </div>

          {/* ===== DETAILS ===== */}
          <div className="teacher-details">
            <h3 className="teacher-name">{studentInfo.full_name}</h3>

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
                customInput={<ReadOnlyInput />}
              />
            </div>

            <div className="info-row">
              <label>Giới tính</label>
              <select name="gender" value={studentInfo.gender} onChange={handleChange} className="infor-select">
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input name="email" value={studentInfo.email || ""} onChange={handleChange} />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>

            <div className="info-row">
              <label>SĐT</label>
              <div className="input-column">
                <input name="phone" value={studentInfo.phone || ""} onChange={handleChange} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            <div className="info-row">
              <label>Địa chỉ</label>
              <div className="input-column">
                <input
                  name="contact_address"
                  value={studentInfo.contact_address || ""}
                  onChange={handleChange}
                />
                {errors.contact_address && (
                  <p className="error-text">{errors.contact_address}</p>
                )}
              </div>
            </div>

            {role === "staff" && (
              <>
                <div className="info-row">
                  <label>Đơn vị</label>
                  <select
                    name="unit"
                    value={studentInfo.unit || ""}
                    onChange={handleChange}
                    className="infor-select"
                  >
                    {org.map((o) => (
                      <option key={o.id} value={o.name}>{o.name}</option>
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

            <button className="save-btn" onClick={handleSave}>
              Lưu thông tin
            </button>

            {user?.roles?.[0]?.role === "admin" && (
              <button
                className="save-btn delete-btn"
                onClick={() => deleteStudentProfile(studentInfo.id)}
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
