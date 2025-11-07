import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Propose_Activity.css";
import CustomSelect from "../../Custom/CustomSelect";
import { course } from "../../../data/course";
import { Faculty } from "../../../data/Faculty";
import { create_activity } from "../../../services/Activity_Services";

export default function Propose_Activity({ iscreate }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startTime: null,
    endTime: null,
    location: "",
    faculty: [],   // ✅ nhiều khoa
    course: [],    // ✅ nhiều khóa
    volunteers: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const facultyOptions = Faculty.map((f) => ({ value: f.id, label: f.name }));
  const courseOptions = course.map((c) => ({ value: c.id, label: c.name }));

  // 🧠 Xử lý nhập liệu cơ bản
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStartTimeChange = (date) => {
    setForm({ ...form, startTime: date });
  };

  const handleEndTimeChange = (date) => {
    setForm({ ...form, endTime: date });
  };

  // 🧠 Chọn nhiều khoa / khóa học
  const handleFacultyChange = (selected) => {
    setForm({ ...form, faculty: selected || [] });
  };

  const handleCourseChange = (selected) => {
    setForm({ ...form, course: selected || [] });
  };

  // 🧩 Kiểm tra hợp lệ
  const validateForm = () => {
    if (
      !form.name ||
      !form.description ||
      !form.startTime ||
      !form.endTime ||
      !form.location ||
      !form.volunteers
    ) {
      return "Vui lòng nhập đầy đủ thông tin.";
    }

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      return "Thời gian kết thúc phải sau thời gian bắt đầu.";
    }

    if (Number(form.volunteers) <= 0) {
      return "Số lượng tình nguyện viên phải lớn hơn 0.";
    }

    return "";
  };

  // 🧾 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();

    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      if (iscreate) {
        const payload = {
          name: form.name,
          description: form.description,
          startTime: form.startTime.toISOString(),
          endTime: form.endTime.toISOString(),
          location: form.location,
          faculty: form.faculty.map((f) => f.value).join(","),  // ✅ convert sang chuỗi id
          course: form.course.map((c) => c.value).join(","),    // ✅ convert sang chuỗi id
          volunteers: Number(form.volunteers),
        };

        const res = await create_activity(payload);

        if (res.success) {
          alert("Tạo hoạt động thành công!");
          setForm({
            name: "",
            description: "",
            startTime: null,
            endTime: null,
            location: "",
            faculty: [],
            course: [],
            volunteers: "",
          });
        } else {
          setErrorMessage(res.message);
        }
      } else {
        alert("Đề xuất hoạt động thành công!");
      }
    } catch (err) {
      setErrorMessage("Đã xảy ra lỗi khi xử lý, vui lòng thử lại sau.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="propose-activity-container">
      <form onSubmit={handleSubmit} className="propose-activity-form">
        <h2 className="form-title">
          {iscreate ? "Tạo hoạt động" : "Đề xuất hoạt động"}
        </h2>

        {/* Tên hoạt động */}
        <div className="form-propose-activity">
          <label>Tên hoạt động:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Nhập tên hoạt động"
          />
        </div>

        {/* Mô tả */}
        <div className="form-propose-activity">
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Nhập mô tả hoạt động"
          />
        </div>

        {/* Thời gian bắt đầu */}
        <div className="form-propose-activity">
          <label>Thời gian bắt đầu hoạt động:</label>
          <DatePicker
            selected={form.startTime}
            onChange={handleStartTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="HH:mm dd/MM/yyyy"
            placeholderText="Chọn thời gian bắt đầu"
            className="custom-date-picker-propose-activity"
          />
        </div>

        {/* Thời gian kết thúc */}
        <div className="form-propose-activity">
          <label>Thời gian kết thúc hoạt động:</label>
          <DatePicker
            selected={form.endTime}
            onChange={handleEndTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="HH:mm dd/MM/yyyy"
            placeholderText="Chọn thời gian kết thúc"
            className="custom-date-picker-propose-activity"
          />
        </div>

        {/* Địa điểm */}
        <div className="form-propose-activity">
          <label>Địa điểm:</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            type="text"
            placeholder="Nhập địa điểm tổ chức"
          />
        </div>

        {/* Khoa áp dụng */}
        <div className="form-propose-activity">
          <label>Áp dụng với các khoa:</label>
          <CustomSelect
            options={facultyOptions}
            isMulti       
            value={form.faculty}
            onChange={handleFacultyChange}
            className="propose-activity-tag-select"
          />
        </div>

        {/* Khóa áp dụng */}
        <div className="form-propose-activity">
          <label>Áp dụng với khóa:</label>
          <CustomSelect
            options={courseOptions}
            isMulti   
            value={form.course}
            onChange={handleCourseChange}
            className="propose-activity-tag-select"
          />
        </div>

        {/* Số lượng tình nguyện viên */}
        <div className="form-propose-activity">
          <label>Số lượng tình nguyện viên:</label>
          <input
            name="volunteers"
            value={form.volunteers}
            onChange={handleChange}
            type="number"
            placeholder="0"
            min="1"
          />
        </div>

        {/* Hiển thị lỗi */}
        {errorMessage && (
          <div className="error-message-propose">{errorMessage}</div>
        )}

        {/* Nút gửi */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-propose-activity-btn"
            disabled={loading}
          >
            <span className="material-symbols-outlined">check</span>
            <span style={{ marginLeft: 8 }}>
              {loading
                ? "Đang xử lý..."
                : iscreate
                ? "Tạo hoạt động"
                : "Gửi đề xuất"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
