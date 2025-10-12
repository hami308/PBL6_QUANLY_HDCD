import "./Activity_Details.css";
import React, { useState } from 'react';
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

function Activity_Details({ activity_details,ismodify=false}) {

  const start_time_org = dayjs(activity_details.time_org_start || "", "HH:mm DD/MM/YYYY");
  const end_time_org = dayjs(activity_details.time_org_end || "", "HH:mm DD/MM/YYYY");

  const [registerStart, setRegisterStart] = useState(activity_details.register_time_start
    ? dayjs(activity_details.register_time_start).format("YYYY-MM-DD")
    : "");
  const [registerEnd, setRegisterEnd] = useState(activity_details.register_time_end
    ? dayjs(activity_details.register_time_end).format("YYYY-MM-DD")
    : "");
  const [eventStartTime, setEventStartTime] = useState(start_time_org.format("HH:mm"));
  const [eventStartDate, setEventStartDate] = useState(start_time_org.format("DD/MM/YYYY"));
  const [eventEndTime, setEventEndTime] = useState(end_time_org.format("HH:mm"));
  const [eventEndDate, setEventEndDate] = useState(end_time_org.format("DD/MM/YYYY"));

  const [volunteers, setVolunteers] = useState(activity_details.volunteers);
  const [location, setLocation] = useState(activity_details.location);
  const [field, setField] = useState(activity_details.field);
  const [requirement, setRequirement] = useState('Sinh viên K22 và khoa Cơ khí');


  if (!activity_details) {
    return (
      <>
        <div className="container">
          <p>Không tìm thấy hoạt động.</p>
        </div>
        <Footer />
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
          <img src={activity_details.image} alt={activity_details.name} className="activity-image-details"/>
      <div className="activity-content-details">
        <div className="field">
           <p>
            <strong>Mô tả:</strong>
            <span>{activity_details.description}</span>
           </p>
        </div>

        <div className="field"><strong>Thời gian đăng ký:</strong>
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
            <input type="date" value={registerEnd} onChange={(e) => setRegisterEnd(e.target.value)} disabled={!ismodify}/>
          </span>
        </div>

        <div className="field"><strong>Thời gian tổ chức:</strong>
          <span className="event-time">
            <input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} disabled={!ismodify}/>
            <input type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} disabled={!ismodify}/>
            <span className="dash">-</span>
            <input type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} disabled={!ismodify}/>
            <input type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} disabled={!ismodify}/>
          </span>
        </div>

        <div className="field">
          <strong>Số lượng tình nguyện viên cần:</strong>
          <span className="editable" contentEditable={ismodify} suppressContentEditableWarning onBlur={(e) => setVolunteers(e.target.innerText)}>
            {volunteers}
          </span>
          <span aria-readonly> sinh viên</span>
        </div>

        <div className="field">
          <strong>Địa điểm:</strong>
          <span className="editable" contentEditable={ismodify} suppressContentEditableWarning onBlur={(e) => setLocation(e.target.innerText)}>
            {location}
          </span>
        </div>

        <div className="field">
          <strong>Lĩnh vực:</strong>
          <span className="editable" contentEditable={ismodify} suppressContentEditableWarning onBlur={(e) => setField(e.target.innerText)}>
            {field}
          </span>
        </div>

        <div className="field">
          <strong>Yêu cầu của sinh viên:</strong>
          <span className="editable" contentEditable={ismodify} suppressContentEditableWarning onBlur={(e) => setRequirement(e.target.innerText)}>
            {requirement}
          </span>
        </div>
        </div>
      </div>
    </>
  );
}

export default Activity_Details;
