import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Activity_details from "../../components/Student/Activity_Details/ActivityDetails_Student.jsx";

import { get_activity_details_of_student } from "../../services/Activity_Services";
import { cancel_registration } from "../../services/Registration_Services.js";
import "./ActivityDetails_Student_page.css";

const ActivityDetails_Student = () => {
  const { id } = useParams();
  const studentId = sessionStorage.getItem("student_id");

  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const res = await get_activity_details_of_student(id, studentId);

    if (res.success) {
      setActivity(res.data.data);
    } else {
      setActivity(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id, studentId]);

  //========= HỦY ĐĂNG KÝ =========
  const handleCancelRegister = async () => {
    const registrationId = activity?.student?.registration?._id;

    if (!registrationId) {
      alert("Không tìm thấy thông tin đăng ký!");
      return;
    }

    if (!window.confirm("Bạn chắc chắn muốn hủy đăng ký hoạt động này?")) {
      return;
    }

    const res = await cancel_registration(registrationId);

    if (res.success) {
      alert("Hủy đăng ký thành công!");
      navigate("/manage-activities-student");

    } else {
      alert("Hủy thất bại: " + res.message);
    }
  };

  if (loading)
    return (
      <div className="activity-details-student">
        <Header />
        <Menu_student />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>;
        <Footer />
      </div>
    );

  if (!activity)
    return (
      <div className="activity-details-student">
        <Header />
        <Menu_student />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Không tìm thấy hoạt động.
        </p>
        <Footer />
      </div>
    );

  return (
    <div className="activity-details-student">
      <Header />
      <Menu_student />

      <Activity_details
        activity_details={activity}
        onCancelRegister={handleCancelRegister}   
      />

      <Footer />
    </div>
  );
};

export default ActivityDetails_Student;
