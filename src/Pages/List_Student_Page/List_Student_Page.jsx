import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import Select from "react-select";
import CancelActivityPopup from "../../components/Popup/CancelActivityPopup.jsx";

import { get_all_faculties } from "../../services/Faculty_Service.js";
import { getClass } from "../../services/Class_Service.js";
import { 
  get_registered_students, 
  get_students_stats_by_activity 
} from "../../services/Activity_Services.js";
import { approve_registration, reject_registration } from "../../services/Registration_Services.js";

import "./List_Student_Page.css";

function List_Student_Page() {
  const { idactivity } = useParams();

  // Tabs
  const [activeTab, setActiveTab] = useState("registered");

  // Filters
  const [faculty, setFaculty] = useState("");
  const [className, setClassName] = useState("");
  const [searchTermMSSV, setSearchTermMSSV] = useState("");
  const [searchTermName, setSearchTermName] = useState("");

  // Data
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentsRegistered, setStudentsRegistered] = useState([]);
  const [studentsAttended, setStudentsAttended] = useState([]);

  // Popup Reject
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);

  // Load initial data
  useEffect(() => {
    async function fetchInit() {
      try {
        const resFaculty = await get_all_faculties();
        const resClass = await getClass();
        const resRegistered = await get_registered_students(idactivity);
        const resAttended = await get_students_stats_by_activity(idactivity);

        setFaculties(resFaculty.data || []);
        setClasses(resClass.data || []);
        setStudentsRegistered(resRegistered?.data?.data || []);
        setStudentsAttended(resAttended?.data?.data || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    }
    fetchInit();
  }, [idactivity]);

  // Students to display
  const students = activeTab === "registered" ? studentsRegistered : studentsAttended;

  // Options for select
  const facultyOptions = faculties.map(f => ({ value: f._id, label: f.name }));
  const classOptions = classes.map(c => ({ value: c._id, label: c.name }));

  // Filter class options by faculty
  const filteredClassOptions = classOptions.filter(
    option => !faculty || classes.find(c => c._id === option.value)?.falcuty_id?._id === faculty
  );

  // Update points
  const handleScoreChange = (studentId, value) => {
    setStudentsAttended(prev =>
      prev.map(s =>
        s.student_id?._id === studentId ? { ...s, total_points: value } : s
      )
    );
  };

  // Filter students
  const filteredStudents = (students || []).filter(s => {
    const mssv = s.student_id?.student_number || "";
    const fullname = s.student_id?.full_name || "";
    return (
      (!faculty || s.faculty_id === faculty) &&
      (!className || s.class_id === className) &&
      (!searchTermMSSV || mssv.includes(searchTermMSSV)) &&
      (!searchTermName || fullname.toLowerCase().includes(searchTermName.toLowerCase()))
    );
  });

  // Table columns
  const columns = activeTab === "attended"
    ? ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái", "Điểm"]
    : ["STT", "MSSV", "Họ và tên", "Khoa", "Lớp", "Trạng thái"];

  // Table data
  const tableData = filteredStudents.map((s, index) => ({
    id: index,
    registration_id: s._id,
    stt: index + 1,
    mssv: s.student_id?.student_number,
    họ_và_tên: s.student_id?.full_name,
    khoa: s.student_id?.falcuty_id?.name,
    lớp: s.student_id?.class_id?.name,
    trạng_thái: s.status,
    ...(activeTab === "attended" && {
      điểm: (
        <input
          type="number"
          value={s.total_points ?? ""}
          onChange={e => handleScoreChange(s.student_id._id, e.target.value)}
          className="score-input"
        />
      ),
    }),
  }));

  // Approve registration
  const handleApprove = async (row) => {
    const registrationId = row.registration_id;
    if (!registrationId) return alert("Không tìm thấy ID đăng ký!");
    const res = await approve_registration(registrationId);
    if (res.success) {
      alert("Duyệt thành công!");
      setStudentsRegistered(prev => prev.filter(item => item._id !== registrationId));
    } else {
      alert("Lỗi: " + res.message);
    }
  };

  // Reject registration (open popup)
  const handleReject = (row) => {
    setSelectedRegistrationId(row.registration_id);
    setIsRejectPopupOpen(true);
  };

  // Submit reject
  const submitReject = async (reason) => {
    if (!reason.trim()) return alert("Vui lòng nhập lý do!");
    const res = await reject_registration(selectedRegistrationId, reason);
    if (res.success) {
        alert("Từ chối thành công!");
        setStudentsRegistered(prev => prev.filter(item => item._id !== selectedRegistrationId));
        setIsRejectPopupOpen(false);
      } else {
        alert("Lỗi: " + res.message);
      }
    };

  // Render action buttons
  const renderActions = (row) =>
    activeTab === "registered" ? (
      <>
        <button className="approve-btn" onClick={() => handleApprove(row)}>Duyệt</button>
        <button className="reject-btn" onClick={() => handleReject(row)}>Từ chối</button>
      </>
    ) : (
      <button className="action-btn">Chi tiết</button>
    );

  // React Select styles
  const customStyles = {
    control: provided => ({ ...provided, borderRadius: "8px", fontSize: "14px", width: "180px", height: "40px" }),
  };

  return (
    <div className="list-student-page">
      <Header />
      <Menu_org />
      <div className="background-list-student-page"></div>

      {/* Title */}
      <div className="cross-bar">
        <p>{activeTab === "registered" ? "Danh sách sinh viên đăng ký" : "Danh sách sinh viên tham gia"}</p>
      </div>

      {/* Tabs */}
      <div className="management-tabs">
        <button className={activeTab === "registered" ? "tab_active" : "tab"} onClick={() => setActiveTab("registered")}>Danh sách đăng ký</button>
        <button className={activeTab === "attended" ? "tab_active" : "tab"} onClick={() => setActiveTab("attended")}>Danh sách tham gia</button>
      </div>

      {/* Filters */}
      <div className="filters-list-student-container">
        <input type="text" placeholder="Mã số sinh viên" value={searchTermMSSV} onChange={e => setSearchTermMSSV(e.target.value)} className="filter-list-student-input" />
        <input type="text" placeholder="Tên sinh viên" value={searchTermName} onChange={e => setSearchTermName(e.target.value)} className="filter-list-student-input" />
        <Select options={facultyOptions} value={facultyOptions.find(opt => opt.value === faculty)} onChange={selected => { setFaculty(selected ? selected.value : ""); setClassName(""); }} placeholder="Khoa" styles={customStyles} isClearable />
        <Select options={filteredClassOptions} value={filteredClassOptions.find(opt => opt.value === className)} onChange={selected => setClassName(selected ? selected.value : "")} placeholder="Lớp" styles={customStyles} isClearable />
      </div>

      {/* Table */}
      <div className="table-list-student-container">
        {filteredStudents.length === 0
          ? <p className="no-student-msg">{activeTab === "registered" ? "Chưa có sinh viên nào đăng ký" : "Chưa có sinh viên nào tham gia"}</p>
          : <CustomTable columns={columns} data={tableData} renderActions={renderActions} />
        }
      </div>

      {/* Cancel/Reject Popup */}
      {isRejectPopupOpen && (
        <CancelActivityPopup
          onClose={() => setIsRejectPopupOpen(false)}
          onConfirm={submitReject}
        />
      )}

      <Footer />
    </div>
  );
}

export default List_Student_Page;
