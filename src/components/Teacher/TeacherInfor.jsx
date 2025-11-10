import "./TeacherInfor.css";
import teacher_pic from "../../assets/images/teacher_pic.jpg";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState, forwardRef } from "react";
import { get_all_org } from "../../services/Org_Service";
import { getStaffInfo, updateStaffInfo } from "../../services/Staff_Service";

registerLocale("vi", vi);

function TeacherInfo({ idstaff }) {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [errors, setErrors] = useState({ email: "", phone: "" });

  const [orgList, setOrgList] = useState([]);

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

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const reponse = await getStaffInfo(idstaff);
        // console.log(reponse);
        setTeacherInfo(reponse);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStaffInfo();
  }, [idstaff]);

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
    if (name === "org_unit_id") {
      const selectedOrg = orgList.find((org) => org._id === value);
      setTeacherInfo((prev) => ({
        ...prev,
        org_unit_id: selectedOrg
          ? { _id: selectedOrg._id, name: selectedOrg.name }
          : null,
      }));
    } else {
      setTeacherInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date) => {
    setTeacherInfo((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const validateAllFields = () => {
    let isValid = true;
    const requiredFields = ["email", "phone", "contact_address", "position"];

    requiredFields.forEach((field) => {
      if (!teacherInfo?.[field] || teacherInfo[field].trim() === "") {
        isValid = false;
      }
    });

    // kiểm tra lỗi validation email/phone
    if (errors.email || errors.phone) {
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    try {
      const isValid = validateAllFields();

      if (!isValid) {
        alert("Vui lòng kiểm tra và nhập đầy đủ thông tin trước khi lưu!");
        return;
      }
      const status = await updateStaffInfo(teacherInfo);
      if (status) {
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin. Vui lòng thử lại!");
    }
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

  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="teacher-info-background">
      <div className="teacher-info-container">
        <a onClick={() => window.history.back()}>
          <span className="material-symbols-outlined">arrow_back</span>
        </a>
        <h2 className="title">Thông tin cán bộ / giảng viên</h2>

        {/* Hiển thị chức vụ và đơn vị nổi bật */}
        <div className="teacher-highlight">
          <p className="teacher-position">{teacherInfo?.position || ""}</p>
          <p className="teacher-unit">{teacherInfo?.org_unit_id?.name || ""}</p>
        </div>

        <div className="teacher-info-content">
          {/* Cột ảnh */}
          <div className="teacher-photo">
            <img src={teacher_pic} alt="Teacher" className="photo-box" />
          </div>

          {/* Cột thông tin */}
          <div className="teacher-details">
            <h3 className="teacher-name">{teacherInfo?.name}</h3>

            <div className="info-row">
              <label>Mã giảng viên</label>
              <input
                type="text"
                name="id"
                value={teacherInfo?.staff_number || " "}
                readOnly
              />
            </div>

            <div className="info-row">
              <label>Ngày sinh</label>
              <DatePicker
                selected={teacherInfo?.date_of_birth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale="vi"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="infor-date-picker"
                customInput={<ReadOnlyInput />}
              />
            </div>

            <div className="info-row">
              <label>Giới tính</label>
              <select
                name="gender"
                value={teacherInfo?.gender}
                onChange={handleChange}
                className="infor-select"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="info-row">
              <label>Email</label>
              <div className="input-column">
                <input
                  type="email"
                  name="email"
                  value={teacherInfo?.email || " "}
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
                  value={teacherInfo?.phone || " "}
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
                name="contact_address"
                value={teacherInfo?.contact_address || " "}
                onChange={handleChange}
              />
            </div>
            {user?.roles?.[0]?.role == "admin" ? (
              <div className="info-row">
                <label>Thuộc đơn vị</label>
                <select
                  name="org_unit_id"
                  value={teacherInfo?.org_unit_id?._id || ""}
                  onChange={handleChange}
                  className="infor-select"
                >
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
            ) : (
              <div className="info-row">
                <label>Thuộc đơn vị</label>
                <input
                  type="text"
                  name="unit"
                  value={teacherInfo?.org_unit_id?.name || ""}
                  readOnly
                />
              </div>
            )}

            <div className="info-row">
              <label>Chức vụ</label>
              <input
                type="text"
                name="position"
                value={teacherInfo?.position || " "}
                onChange={handleChange}
              />
            </div>

            {(user?.roles?.[0]?.role === "staff" ||
              user?.roles?.[0]?.role === "admin") && (
              <button className="save-btn" onClick={handleSave}>
                Lưu thông tin
              </button>
            )}

            {user?.roles?.[0]?.role === "admin" && (
              <button
                className="delete-btn"
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
