import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Propose_Activity.css";
import CustomSelect from "../../Custom/CustomSelect";
import {course} from "../../../data/course";
import {Faculty} from "../../../data/Faculty";

export default function Propose_Activity() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startTime: null, 
    endTime: null,
    location: "",
    organizer: "",
    faculty: "",
    course: "",
    volunteers: "",
  });

  const facultyOptions = Faculty.map(f => ({ value: f.id, label: f.name }));
  const courseOptions = course.map(c => ({ value: c.id, label: c.name }));
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStartTimeChange = (date) => {
    setForm({ ...form, startTime: date });
  };

  const handleEndTimeChange = (date) => {
    setForm({ ...form, endTime: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
  };

  return (
    <div className="propose-activity-container">
      <form onSubmit={handleSubmit} className="propose-activity-form">
        <h2 className="form-title">Đề xuất hoạt động</h2>

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

        {/*  Thời gian bắt đầu hoạt động */}
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

        {/*  Thời gian kết thúc hoạt động */}
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

        <div className="form-propose-activity">
          <label>Áp dụng với các khoa:</label>
          <CustomSelect 
              options={facultyOptions} 
              className="propose-activity-tag-select"
          />
        </div>

        <div className="form-propose-activity">
          <label>Áp dụng với khóa:</label>
          <CustomSelect 
              options={courseOptions} 
              className="propose-activity-tag-select"
          />
        </div>

        <div className="form-propose-activity">
          <label>Số lượng tình nguyện viên:</label>
          <input
            name="volunteers"
            value={form.volunteers}
            onChange={handleChange}
            type="number"
            placeholder="1"
          />
        </div>

        <div className="form-actions">
          <button type="submit-propose-activity" className="submit-propose-activity-btn">
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      </form>
    </div>
  );
}
