import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Propose_Activity.css";

import { get_all_fields } from "../../../services/Field_Service";
import { get_all_faculties } from "../../../services/Faculty_Service";
import { get_all_cohort } from "../../../services/Cohort_Services";
import {
  create_activity,
  propose_activity,
} from "../../../services/Activity_Services";
import CustomSelect from "../../Custom/CustomSelect";
// import { id } from "date-fns/locale";

export default function Propose_Activity({ iscreate }) {
  const [form, setForm] = useState({
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

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [orgUnitId, setOrgUnitId] = useState(null);

  // ====================== FETCH DATA ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) throw new Error("Không tìm thấy thông tin người dùng.");
        const storedOrgUnitId = sessionStorage.getItem("orgUnitId");
        if (storedOrgUnitId) setOrgUnitId(storedOrgUnitId);

        // Faculty list
        const facRes = await get_all_faculties();
        if (facRes.success)
          setFacultyOptions(
            facRes.data.map((f) => ({
              value: f._id || f.id,
              label: f.name,
            }))
          );

        // Cohort list
        const cohortRes = await get_all_cohort();
        if (cohortRes.success)
          setCourseOptions(
            cohortRes.data.map((c) => ({
              value: c._id || c.id,
              label: c.name || c.cohort_name || `Khóa ${c.year}`,
            }))
          );

        // Field list
        const fieldRes = await get_all_fields();
        if (fieldRes.success)
          setFieldOptions(
            fieldRes.data.map((f) => ({
              value: f._id || f.id,
              label: f.name,
            }))
          );
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  // ====================== INPUT HANDLER ======================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleStartTimeChange = (date) =>
    setForm({ ...form, startTime: date });

  const handleEndTimeChange = (date) =>
    setForm({ ...form, endTime: date });

  const handleFacultyChange = (selected) =>
    setForm({ ...form, faculty: selected });

  const handleCourseChange = (selected) =>
    setForm({ ...form, course: selected });

  // ====================== VALIDATE ======================
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

    if (!orgUnitId) return "Không xác định đơn vị tổ chức.";

    return "";
  };

  // ====================== BUILD REQUIREMENTS ======================
  // const extractYear = (label) => {
  //   if (!label || typeof label !== "string") return null;
  //   const match = label.match(/\d{4}/);
  //   return match ? match[0] : null;
  // };

  const buildRequirements = () => {
    let req = [];

    // ===== Faculty =====
    if (!form.faculty.some((f) => f.value === "all")) {
      req.push(
        ...form.faculty.map((f) => ({
          type: "faculty",
          id: f.value,
        }))
      );
    }

    // ===== Course / Cohort =====
    if (!form.course.some((c) => c.value === "all")) {
      req.push(
        ...form.course.map((c) => ({
          type: "cohort",
          id: c.value,
        }))
      );
    }
    console.log("Built requirements:", req);
    return req;
  };

  // ====================== SUBMIT ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return setErrorMessage(error);

    setErrorMessage("");
    setLoading(true);

    try {
      const requirements = buildRequirements();
      
      const payload = {
        title: form.name,
        description: form.description,
        start_time: form.startTime.toISOString(),
        end_time: form.endTime.toISOString(),
        location: form.location,
        field_id: form.field,
        capacity: Number(form.volunteers),
        points: Number(form.maxpoint),
        org_unit_id: orgUnitId,
        requirements: requirements, 
        requires_approval: true,
      };
      console.log("Payload:", payload);
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

  // ====================== RENDER ======================
  return (
    <div className="propose-activity-container">
      <form onSubmit={handleSubmit} className="propose-activity-form">
        <h2 className="form-title">
          {iscreate ? "Tạo hoạt động" : "Đề xuất hoạt động"}
        </h2>

        {/* Name */}
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

        {/* Description */}
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

        {/* Field */}
        <div className="form-propose-activity">
          <label>Lĩnh vực:</label>
          <select
            name="field"
            value={form.field}
            onChange={handleChange}
            className="select-basic"
          >
            <option value="">-- Chọn lĩnh vực --</option>
            {fieldOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div className="form-propose-activity">
          <label>Thời gian bắt đầu:</label>
          <DatePicker
            selected={form.startTime}
            onChange={handleStartTimeChange}
            showTimeSelect
            dateFormat="HH:mm dd/MM/yyyy"
            className="custom-date-picker-propose-activity"
          />
        </div>

        <div className="form-propose-activity">
          <label>Thời gian kết thúc:</label>
          <DatePicker
            selected={form.endTime}
            onChange={handleEndTimeChange}
            showTimeSelect
            dateFormat="HH:mm dd/MM/yyyy"
            className="custom-date-picker-propose-activity"
          />
        </div>

        {/* Faculty */}
        <div className="form-propose-activity">
          <label>Áp dụng với khoa:</label>
          <CustomSelect
            options={facultyOptions}
            value={form.faculty}
            onChange={handleFacultyChange}
            isMulti
          />
        </div>

        {/* Course */}
        <div className="form-propose-activity">
          <label>Áp dụng với khóa:</label>
          <CustomSelect
            options={courseOptions}
            value={form.course}
            onChange={handleCourseChange}
            isMulti
          />
        </div>

        {/* Location */}
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

        {/* Volunteers */}
        <div className="form-propose-activity">
          <label>Số lượng tình nguyện viên:</label>
          <input
            name="volunteers"
            value={form.volunteers}
            onChange={handleChange}
            type="number"
            min="1"
          />
        </div>

        {/* Max Points */}
        <div className="form-propose-activity">
          <label>Điểm tối đa:</label>
          <input
            name="maxpoint"
            value={form.maxpoint}
            onChange={handleChange}
            type="number"
            min="1"
          />
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="error-message-propose">{errorMessage}</div>
        )}

        {/* Submit */}
        <div className="form-actions">
          <button className="submit-propose-activity-btn" disabled={loading}>
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
