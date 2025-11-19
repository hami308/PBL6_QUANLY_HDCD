import "./Activity_Details.css";
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";

import CustomSelect from "../Custom/CustomSelect.jsx";
import CancelActivityPopup from "../Popup/CancelActivityPopup.jsx";
import Activity_pic from "../../assets/images/activity.jpg";

import { get_all_fields } from "../../services/Field_Service.js";
import { get_all_faculties } from "../../services/Faculty_Service.js";
import { get_all_cohort } from "../../services/Cohort_Services.js";
import { register_activity } from "../../services/Activity_Services.js";

registerLocale("vi", vi);

function Activity_Details({ activity_details, ismodify = false }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const handleConfirmCancel = (reason) => console.log("Lý do hủy:", reason);

  const start_time_org = dayjs(activity_details.start_time || "");
  const end_time_org = dayjs(activity_details.end_time || "");

  const [registerStart, setRegisterStart] = useState(
    activity_details.registration_open
      ? new Date(activity_details.registration_open)
      : null
  );
  const [registerEnd, setRegisterEnd] = useState(
    activity_details.registration_close
      ? new Date(activity_details.registration_close)
      : null
  );

  const [eventStartDate, setEventStartDate] = useState(
    start_time_org.isValid() ? start_time_org.toDate() : null
  );
  const [eventEndDate, setEventEndDate] = useState(
    end_time_org.isValid() ? end_time_org.toDate() : null
  );

  const [volunteers, setVolunteers] = useState(activity_details.capacity);
  const [location, setLocation] = useState(activity_details.location);
  const [field_activity, setField] = useState(activity_details.field || "");

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [facRes, cohRes, fieldRes] = await Promise.all([
          get_all_faculties(),
          get_all_cohort(),
          get_all_fields()
        ]);

        if (facRes.success) {
          setFacultyOptions(
            facRes.data.map((f) => ({ value: f.name, label: f.name }))
          );
        }

        if (cohRes.success) {
          setCourseOptions(
            cohRes.data.map((c) => ({ value: c.year, label: `Khóa ${c.year}` }))
          );
        }

        if (fieldRes.success) {
          setFieldOptions(fieldRes.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu options:", err);
      }
    }

    fetchOptions();
  }, []);

  const courseValues = (activity_details.requirements || [])
    .filter((r) => r.type === "cohort")
    .map((r) => ({ value: r.year, label: `Khóa ${r.year}` }));

  const facultyValues = (activity_details.requirements || [])
    .filter((r) => r.type === "faculty" || r.type === "falcuty")
    .map((r) => ({ value: r.name, label: r.name }));

  const [courseValuesState, setCourseValuesState] = useState(courseValues);
  const [facultyValuesState, setFacultyValuesState] = useState(facultyValues);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxVisibleHeight = lineHeight * 3;
      setIsOverflowing(el.scrollHeight > maxVisibleHeight + 5);
    }
  }, [activity_details.description]);

  // Hàm đăng ký tham gia với alert xác nhận
  const handleRegister = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tham gia hoạt động!");
      return;
    }

    if (!(user?.roles?.[0]?.role === "student")) {
      alert("Chỉ sinh viên mới được đăng ký tham gia hoạt động!");
      return;
    }

    const confirmRegister = window.confirm(
      `Bạn có chắc chắn muốn đăng ký tham gia hoạt động "${activity_details.title}"?`
    );
    if (!confirmRegister) return;

    try {
      const res = await register_activity(activity_details._id);
      if (res.success) {
        alert("Đăng ký tham gia hoạt động thành công!");
      } else {
        alert(`Đăng ký thất bại: ${res.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="activity-card-details">
      <div className="activity--details">
        <h1 className="activity-title-details">{activity_details.title}</h1>
        <button className="join-btn" onClick={handleRegister}>
          Đăng ký tham gia
        </button>
      </div>

      <div className="activity-team-details">
        {activity_details.org_unit_id?.name || "Không có đơn vị tổ chức"}
      </div>

      <img
        src={activity_details.image || Activity_pic}
        alt={activity_details.title}
        className="activity-image-details"
      />

      <div className="activity-content-details">
        <div className="activity-description-wrapper">
          <strong>Mô tả:</strong>
          <div
            ref={descRef}
            className={`activity-description ${
              showFullDescription ? "expanded" : "collapsed"
            }`}
          >
            {activity_details.description}
          </div>
          {isOverflowing && (
            <button
              className="collapse-btn"
              onClick={() => setShowFullDescription((prev) => !prev)}
            >
              {showFullDescription ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>

        <div className="field">
          <strong>Thời gian đăng ký:</strong>
          <span className="register-time">
            <DatePicker
              selected={registerStart}
              onChange={setRegisterStart}
              dateFormat="dd/MM/yyyy"
              locale="vi"
              disabled={!ismodify}
              className="custom-date-picker"
            />
            <span className="dash">-</span>
            <DatePicker
              selected={registerEnd}
              onChange={setRegisterEnd}
              dateFormat="dd/MM/yyyy"
              locale="vi"
              disabled={!ismodify}
              className="custom-date-picker"
            />
          </span>
        </div>

        <div className="field">
          <strong>Thời gian tổ chức:</strong>
          <span className="event-time">
            <DatePicker
              selected={eventStartDate}
              onChange={setEventStartDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="HH:mm dd/MM/yyyy"
              locale="vi"
              disabled={!ismodify}
              className="custom-date-picker"
            />
            <span className="dash">-</span>
            <DatePicker
              selected={eventEndDate}
              onChange={setEventEndDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="HH:mm dd/MM/yyyy"
              locale="vi"
              disabled={!ismodify}
              className="custom-date-picker"
            />
          </span>
        </div>

        <div className="field">
          <strong>Số lượng tình nguyện viên cần:</strong>
          <div>
            <span
              className="editable"
              contentEditable={ismodify}
              suppressContentEditableWarning
              onBlur={(e) => setVolunteers(e.target.innerText)}
            >
              {volunteers}
            </span>
            <span> sinh viên</span>
          </div>
        </div>

        <div className="field">
          <strong>Địa điểm:</strong>
          <span
            className="editable"
            contentEditable={ismodify}
            suppressContentEditableWarning
            onBlur={(e) => setLocation(e.target.innerText)}
          >
            {location}
          </span>
        </div>

        <div className="field">
          <strong>Lĩnh vực:</strong>
          <select
            value={field_activity}
            onChange={(e) => setField(e.target.value)}
            className="field-select"
            disabled={!ismodify}
          >
            {fieldOptions.map((option) => (
              <option key={option._id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <strong>Yêu cầu theo khóa:</strong>
          <CustomSelect
            options={courseOptions}
            value={courseValuesState}
            onChange={setCourseValuesState}
            className="activity-tag-select"
            readOnly={!ismodify}
          />
        </div>

        <div className="field">
          <strong>Yêu cầu theo khoa:</strong>
          <CustomSelect
            options={facultyOptions}
            value={facultyValuesState}
            onChange={setFacultyValuesState}
            className="activity-tag-select"
            readOnly={!ismodify}
          />
        </div>
      </div>

      {ismodify && (
        <div className="manage-infot-activity">
          <button className="button-update-infor-activity">Cập nhật</button>
          <button onClick={() => setShowCancelPopup(true)}>Hủy hoạt động</button>

          {showCancelPopup && (
            <CancelActivityPopup
              onClose={() => setShowCancelPopup(false)}
              onConfirm={handleConfirmCancel}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Activity_Details;
