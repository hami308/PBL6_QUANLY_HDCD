import "./TeacherInfor.css";
import defaultAvatar from "../../assets/images/teacher_pic.jpg";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import { useEffect, useState, forwardRef } from "react";

import { get_all_org } from "../../services/Org_Service";
import { getStaffInfo, updateStaffInfo } from "../../services/Staff_Service";
import { get_all_position } from "../../services/Position_Service";

registerLocale("vi", vi);

function TeacherInfo({ idstaff }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  /* ================= STATE ================= */
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [orgList, setOrgList] = useState([]);
  const [positionList, setPositionList] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    get_all_org().then((res) => res?.data && setOrgList(res.data));
    get_all_position().then((res) => res?.success && setPositionList(res.data));
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaffInfo(idstaff);
        setTeacherInfo(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (idstaff) fetchStaff();
  }, [idstaff]);

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    let msg = "";

    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = "Email không hợp lệ";
    }

    if (name === "phone") {
      if (!/^0\d{9}$/.test(value)) msg = "SĐT phải có 10 số và bắt đầu bằng 0";
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const validateAllFields = () => {
    const fields = ["email", "phone", "contact_address", "position"];
    return fields.every((f) => teacherInfo?.[f] && !errors[f]);
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrgChange = (e) => {
    const org = orgList.find((o) => o._id === e.target.value);
    setTeacherInfo((prev) => ({
      ...prev,
      org_unit_id: org ? { _id: org._id, name: org.name } : null,
    }));
  };

  const handleDateChange = (date) => {
    setTeacherInfo((prev) => ({ ...prev, date_of_birth: date }));
  };

  /* ===== IMAGE (GIỐNG STUDENT) ===== */
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
      setTeacherInfo((prev) => ({
        ...prev,
        staff_image: reader.result, // base64 / URL
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!validateAllFields()) {
      alert("Vui lòng kiểm tra và nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await updateStaffInfo(teacherInfo);
      console.log(res.status);
      res?.status === 200
        ? alert("Cập nhật thông tin thành công!")
        : alert("Cập nhật thông tin thất bại!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  /* ================= DATE INPUT ================= */
  const ReadOnlyInput = forwardRef(({ value, onClick }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      className="infor-date-picker"
    />
  ));

  if (!teacherInfo) return <p>Đang tải thông tin cán bộ...</p>;

  /* ================= JSX ================= */
  return (
    <div className="teacher-info-background">
      <div className="teacher-info-container">
        <h2 className="title">Thông tin cán bộ / giảng viên</h2>

        <div className="teacher-info-content">
          {/* ===== AVATAR ===== */}
          <div className="teacher-photo">
            <input
              type="file"
              hidden
              accept="image/*"
              id="teacher-upload"
              onChange={handleImageChange}
            />
            <label htmlFor="teacher-upload" className="photo-upload-label">
              <img
                src={previewImage || teacherInfo.staff_image || defaultAvatar}
                alt="avatar"
                className="photo-box"
              />
              <p className="change-photo-text">Thay ảnh</p>
            </label>
          </div>

          {/* ===== INFO ===== */}
          <div className="teacher-details">
            <h3 className="teacher-name">{teacherInfo.full_name}</h3>

            <div className="info-row">
              <label>Mã giảng viên</label>
              <input value={teacherInfo.staff_number} readOnly />
            </div>

            <div className="info-row">
              <label>Ngày sinh</label>
              <DatePicker
                selected={teacherInfo.date_of_birth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale="vi"
                customInput={<ReadOnlyInput />}
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
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="info-row">
              <label>Email</label>
              <input
                name="email"
                value={teacherInfo.email || ""}
                onChange={handleChange}
                onBlur={(e) => validateField("email", e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="info-row">
              <label>SĐT</label>
              <input
                name="phone"
                value={teacherInfo.phone || ""}
                onChange={handleChange}
                onBlur={(e) => validateField("phone", e.target.value)}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            <div className="info-row">
              <label>Địa chỉ</label>
              <input
                name="contact_address"
                value={teacherInfo.contact_address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="info-row">
              <label>Đơn vị</label>
              {user?.roles?.[0]?.role === "admin" ? (
                <select
                  value={teacherInfo.org_unit_id?._id || ""}
                  onChange={handleOrgChange}
                  className="infor-select"
                >
                  {orgList.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={teacherInfo.org_unit_id?.name || ""} readOnly />
              )}
            </div>

            <div className="info-row">
              <label>Chức vụ</label>
              {user?.roles?.[0]?.role === "admin" ? (
                <select
                  name="position"
                  value={teacherInfo.position || ""}
                  onChange={handleChange}
                  className="infor-select"
                >
                  {positionList.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={teacherInfo.position || ""} readOnly />
              )}
            </div>

            {(user?.roles?.[0]?.role === "staff" ||
              user?.roles?.[0]?.role === "admin") && (
              <button className="save-btn" onClick={handleSave}>
                Lưu thông tin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherInfo;
