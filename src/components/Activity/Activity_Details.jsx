import "./Activity_Details.css";
import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import { field } from "../../data/field";
import CustomSelect from "../Custom/CustomSelect.jsx";
import CancelActivityPopup from "../Popup/CancelActivityPopup.jsx";
import Activity_pic from "../../assets/images/activity.jpg";

import { get_all_faculties } from "../../services/Faculty_Service.js";
import { get_all_cohort } from "../../services/Cohort_Services.js";

registerLocale("vi", vi);

function Activity_Details({ activity_details, ismodify }) {
  ismodify = ismodify || false;
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Popup hủy hoạt động
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const handleConfirmCancel = (reason) => console.log("Lý do hủy:", reason);

  // Thời gian
  const start_time_org = dayjs(activity_details.start_time || "");
  const end_time_org = dayjs(activity_details.end_time || "");
  const [registerStart, setRegisterStart] = useState(
    activity_details.registration_open ? new Date(activity_details.registration_open) : null
  );
  const [registerEnd, setRegisterEnd] = useState(
    activity_details.registration_close ? new Date(activity_details.registration_close) : null
  );
  const [eventStartDate, setEventStartDate] = useState(
    start_time_org.isValid() ? start_time_org.toDate() : null
  );
  const [eventEndDate, setEventEndDate] = useState(
    end_time_org.isValid() ? end_time_org.toDate() : null
  );

  // Số lượng, địa điểm, lĩnh vực
  const [volunteers, setVolunteers] = useState(activity_details.capacity);
  const [location, setLocation] = useState(activity_details.location);
  const [field_activity, setField] = useState(activity_details.field || "");

  // Danh sách khóa và khoa từ API
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    async function fetchFacultyAndCohort() {
      try {
        const [facRes, cohRes] = await Promise.all([
          get_all_faculties(),
          get_all_cohort()
        ]);

        if (facRes.success) {
          const facOptions = facRes.data.map((f) => ({ value: f.name, label: f.name }));
          setFacultyOptions(facOptions);
        }

        if (cohRes.success) {
          const cohOptions = cohRes.data.map((c) => ({ value: c.year, label: `Khóa ${c.year}` }));
          setCourseOptions(cohOptions);
        }
      } catch (err) {
        console.error("Lỗi khi lấy khoa/khóa:", err);
      }
    }
    fetchFacultyAndCohort();
  }, []);

  // Giá trị đã chọn từ requirements
  const courseValues = (activity_details.requirements || [])
    .filter((r) => r.type === "cohort")
    .map((r) => ({ value: r.year, label: `Khóa ${r.year}` }));

  const facultyValues = (activity_details.requirements || [])
    .filter((r) => r.type === "faculty" || r.type === "falcuty")
    .map((r) => ({ value: r.name, label: r.name }));

  const [courseValuesState, setCourseValuesState] = useState(courseValues);
  const [facultyValuesState, setFacultyValuesState] = useState(facultyValues);

  // Mô tả
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

  return (
    <div className="activity-card-details">
      <div className="activity--details">
        <h1 className="activity-title-details">{activity_details.title}</h1>
        <button
          className="join-btn"
          onClick={() => {
            if (!user) alert("Vui lòng đăng nhập để tham gia hoạt động!");
            else alert("Đăng ký tham gia hoạt động thành công!");
          }}
        >
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
        {/* Mô tả */}
        <div className="activity-description-wrapper">
          <strong>Mô tả:</strong>
          <div
            ref={descRef}
            className={`activity-description ${showFullDescription ? "expanded" : "collapsed"}`}
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

        {/* Thời gian đăng ký */}
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

        {/* Thời gian tổ chức */}
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

        {/* Số lượng */}
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

        {/* Địa điểm */}
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

        {/* Lĩnh vực */}
        <div className="field">
          <strong>Lĩnh vực:</strong>
          <select
            value={field_activity}
            onChange={(e) => setField(e.target.value)}
            className="field-select"
            disabled={!ismodify}
          >
            {field.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Yêu cầu theo khóa */}
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

        {/* Yêu cầu theo khoa */}
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

      {/* Quản lý hoạt động */}
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
