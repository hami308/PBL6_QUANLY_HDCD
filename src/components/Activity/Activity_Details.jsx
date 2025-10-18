import "./Activity_Details.css";
import React, { useState,useRef ,useEffect} from 'react';
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import { field } from "../../data/field";
import { course } from "../../data/course";
import { Faculty } from "../../data/Faculty";
import CustomSelect from "../Custom/CustomSelect.jsx";
registerLocale("vi", vi);

function Activity_Details({ activity_details, ismodify = false }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const start_time_org = dayjs(activity_details.time_org_start || "", "HH:mm YYYY-MM-DD");
  const end_time_org = dayjs(activity_details.time_org_end || "", "HH:mm YYYY-MM-DD");

  const [registerStart, setRegisterStart] = useState(activity_details.register_time_start
    ? dayjs(activity_details.register_time_start).format("YYYY-MM-DD")
    : "");
  const [registerEnd, setRegisterEnd] = useState(activity_details.register_time_end
    ? dayjs(activity_details.register_time_end).format("YYYY-MM-DD")
    : "");
  const [eventStartDate, setEventStartDate] = useState(start_time_org.isValid() ? start_time_org.toDate() : null);
  const [eventEndDate, setEventEndDate] = useState(end_time_org.isValid() ? end_time_org.toDate() : null);

  const [proposeDate, setProposeDate] = useState(
    activity_details.time_propose ? new Date(activity_details.time_propose) : null
  );
  const [approvedDate, setApprovedDate] = useState(
    activity_details.time_approve_propose ? new Date(activity_details.time_approve_propose) : null
  );

  const [volunteers, setVolunteers] = useState(activity_details.volunteers);
  const [location, setLocation] = useState(activity_details.location);
  const [field_activity, setField] = useState(activity_details.field);

  const courseOptions = course.map(c => ({ value: c.id, label: c.name }));
  const courseValues = activity_details.requirement_by_course
    ? activity_details.requirement_by_course.split(",").map(c => {
      const id = parseInt(c.trim(), 10);
      const found = course.find(opt => opt.id === id);
      return found ? { value: found.id, label: found.name } : { value: id, label: c };
    })
    : [];
  const [courseValuesState, setCourseValuesState] = useState(courseValues);

  const facultyOptions = Faculty.map(f => ({ value: f.id, label: f.name }));
  const facultyValues = activity_details.requirement_by_faculty
    ? activity_details.requirement_by_faculty.split(",").map(f => {
      const id = parseInt(f.trim(), 10);
      const found = Faculty.find(opt => opt.id === id);
      return found ? { value: found.id, label: found.name } : { value: id, label: f };
    })
    : [];
  const [facultyValuesState, setFacultyValuesState] = useState(facultyValues);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxVisibleHeight = lineHeight * 3; // Giới hạn 3 dòng
      setIsOverflowing(el.scrollHeight > maxVisibleHeight + 5);
    }
  }, [activity_details.description]);


  if (!activity_details) {
    return (
      <>
        <div className="container">
          <p>Không tìm thấy hoạt động.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="activity-card-details">
        <div className="activity--details">
          <h1 className="activity-title-details">{activity_details.name}</h1>
          <button className="join-btn">Đăng ký tham gia</button>
        </div>
        <div className="activity-team-details">{activity_details.org}</div>
        <img
          src={activity_details.image}
          alt={activity_details.name}
          className="activity-image-details"
        />
        <div className="activity-content-details">

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


          <div className="field">
            <strong>Thời gian đăng ký:</strong>
            <span className="register-time">
              <DatePicker
                selected={registerStart ? new Date(registerStart) : null}
                onChange={(date) => setRegisterStart(dayjs(date).format("YYYY-MM-DD"))}
                dateFormat="dd/MM/yyyy"
                locale="vi"
                disabled={!ismodify}
                className="custom-date-picker"
              />
              <span className="dash">-</span>
              <DatePicker
                selected={registerEnd ? new Date(registerEnd) : null}
                onChange={(date) => setRegisterEnd(dayjs(date).format("YYYY-MM-DD"))}
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
                onChange={(date) => setEventStartDate(date)}
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
                onChange={(date) => setEventEndDate(date)}
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
          {user?.role === "org" && (<>
          <div className="field">
            <strong>Thời gian đề xuất:</strong>
            <DatePicker
              selected={proposeDate}
              onChange={(date) => setProposeDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="HH:mm dd/MM/yyyy"
              locale="vi"
              disabled={true}
              className="custom-date-picker"
            />
          </div>

          <div className="field">
            <strong>Thời gian được duyệt:</strong>
            <DatePicker
              selected={approvedDate}
              onChange={(date) => setApprovedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="HH:mm dd/MM/yyyy"
              locale="vi"
              disabled={true}
              className="custom-date-picker"
            />
          </div>
        </>)}

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
              <span aria-readonly> sinh viên</span>
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
              {field.map((option) => (
                <option key={option.id} value={option.name}>
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
            <button className="button-cancel-activity">Hủy hoạt động</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Activity_Details;
