import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Propose_Activity.css";

import { get_all_fields } from "../../../services/Field_Service";
import { get_all_faculties } from "../../../services/Faculty_Service";
import { get_all_cohort } from "../../../services/Cohort_Services";
import { getStaffInfo } from "../../../services/Staff_Service";
import {
  create_activity,
  propose_activity,
} from "../../../services/Activity_Services";
import CustomSelect from "../../Custom/CustomSelect";
export default function Propose_Activity({ iscreate }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startTime: null,
    endTime: null,
    location: "",
    faculty: [],
    course: [],
    field: "", // Chỉ 1 lĩnh vực
    volunteers: "",
    maxpoint: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [orgUnitId, setOrgUnitId] = useState(null);

  // --- Gọi API lấy dữ liệu cơ bản ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) throw new Error("Không tìm thấy thông tin người dùng.");

        const staff = await getStaffInfo(user.id);
        if (staff && staff.org_unit_id) {
          setOrgUnitId(staff.org_unit_id);
        } else {
          console.warn("Không tìm thấy org_unit_id trong staff info.");
        }

        // Khoa
        const facRes = await get_all_faculties();
        if (facRes.success && Array.isArray(facRes.data)) {
          setFacultyOptions(
            facRes.data.map((f) => ({
              value: f._id || f.id,
              label: f.name,
            }))
          );
        }

        // Khóa
        const cohortRes = await get_all_cohort();
        if (cohortRes.success && Array.isArray(cohortRes.data)) {
          setCourseOptions(
            cohortRes.data.map((c) => ({
              value: c._id || c.id,
              label: c.name || c.cohort_name || `Khóa ${c.year}`,
            }))
          );
        }

        // Lĩnh vực
        const fieldRes = await get_all_fields();
        if (fieldRes.success && Array.isArray(fieldRes.data)) {
          setFieldOptions(
            fieldRes.data.map((f) => ({
              value: f._id || f.id,
              label: f.name,
            }))
          );
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  // --- Handle input ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleStartTimeChange = (date) => setForm({ ...form, startTime: date });
  const handleEndTimeChange = (date) => setForm({ ...form, endTime: date });
  const handleFacultyChange = (selected) => setForm({ ...form, faculty: selected || [] });
  const handleCourseChange = (selected) => setForm({ ...form, course: selected || [] });

  // --- Validate ---
  const validateForm = () => {
    if (
      !form.name ||
      !form.description ||
      !form.startTime ||
      !form.endTime ||
      !form.location ||
      !form.volunteers ||
      !form.maxpoint ||
      !form.field
    ) {
      return "Vui lòng nhập đầy đủ thông tin.";
    }

    if (form.endTime <= form.startTime)
      return "Thời gian kết thúc phải sau thời gian bắt đầu.";

    if (Number(form.volunteers) <= 0)
      return "Số lượng tình nguyện viên phải lớn hơn 0.";

    if (Number(form.maxpoint) <= 0)
      return "Điểm tối đa phải lớn hơn 0.";

    if (!orgUnitId)
      return "Không xác định được khoa (org_unit_id).";

    return "";
  };

  // --- Submit ---
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
      const payload = {
        title: form.name,
        description: form.description,
        start_time: form.startTime.toISOString(),
        end_time: form.endTime.toISOString(),
        location: form.location,
        faculty: form.faculty.map((f) => f.value).join(","),
        course: form.course.map((c) => c.value).join(","),
        field: form.field,
        capacity: Number(form.volunteers),
        points: Number(form.maxpoint),
        org_unit_id: orgUnitId,
      };

      const res = iscreate
        ? await create_activity(payload)
        : await propose_activity(payload);

      if (res.success) {
        alert(iscreate ? "Tạo hoạt động thành công!" : "Đề xuất thành công!");
        setForm({
          name: "",
          description: "",
          startTime: null,
          endTime: null,
          location: "",
          faculty: [],
          course: [],
          field: "",
          volunteers: "",
          maxpoint: "",
        });
      } else {
        setErrorMessage(res.message || "Thao tác thất bại.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
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

        {/* Lĩnh vực (select bình thường) */}
        <div className="form-propose-activity">
          <label>Lĩnh vực:</label>
          <select
            name="field"
            value={form.field}
            onChange={(e) => setForm({ ...form, field: e.target.value })}
            className="select-basic"
          >
            <option value="">-- Chọn một lĩnh vực --</option>
            {fieldOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Thời gian bắt đầu */}
        <div className="form-propose-activity">
          <label>Thời gian bắt đầu:</label>
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
          <label>Thời gian kết thúc:</label>
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

        {/* Khoa */}
        <div className="form-propose-activity">
          <label>Áp dụng với các khoa:</label>
          <CustomSelect
            options={facultyOptions}
            isMulti
            value={form.faculty}
            onChange={handleFacultyChange}
          />
        </div>

        {/* Khóa */}
        <div className="form-propose-activity">
          <label>Áp dụng với khóa:</label>
          <CustomSelect
            options={courseOptions}
            isMulti
            value={form.course}
            onChange={handleCourseChange}
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

        {/* Điểm tối đa */}
        <div className="form-propose-activity">
          <label>Điểm tối đa:</label>
          <input
            name="maxpoint"
            value={form.maxpoint}
            onChange={handleChange}
            type="number"
            placeholder="Nhập điểm tối đa"
            min="1"
          />
        </div>

        {/* Thông báo lỗi */}
        {errorMessage && (
          <div className="error-message-propose">{errorMessage}</div>
        )}

        {/* Nút submit */}
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
