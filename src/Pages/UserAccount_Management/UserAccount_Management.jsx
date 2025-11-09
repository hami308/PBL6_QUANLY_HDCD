import Header from "../../components/Header/Header";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import MenuAdmin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount_Management.css";
import { getStudents, getTeachers } from "../../services/manageAccount_Service";

function UserAccount_Management() {
  const [activeTab, setActiveTab] = useState("student");
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách sinh viên
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách giảng viên
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi API mỗi khi đổi tab
  useEffect(() => {
    if (activeTab === "student" && students.length === 0) {
      fetchStudents();
    } else if (activeTab === "teacher" && teachers.length === 0) {
      fetchTeachers();
    }
  }, [
    activeTab,
    fetchStudents,
    fetchTeachers,
    students.length,
    teachers.length,
  ]);

  return (
    <div className="user-account-management">
      <Header />
      <MenuAdmin />

      {/* Tabs */}
      <div className="management-tabs">
        <button
          className={activeTab === "student" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("student")}
        >
          Tài khoản sinh viên
        </button>
        <button
          className={activeTab === "teacher" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("teacher")}
        >
          Tài khoản cán bộ, giảng viên
        </button>
      </div>

      <Filter_Admin activeTab={activeTab} />

      {/* Nội dung từng tab */}
      <div className="tabs-content">
        <div className="delete-section">
          <button
            className="delete-btn"
            onClick={() => setShowDeleteOptions((prev) => !prev)}
          >
            🗑 Xóa
          </button>
          <div className={`delete-dropdown ${showDeleteOptions ? "show" : ""}`}>
            <div className="delete-option">Xóa tất cả</div>
            <div className="delete-option">Xóa các tài khoản đã chọn</div>
          </div>
        </div>

        {/* Nếu đang loading thì hiển thị loading */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {activeTab === "student" && (
              <>
                <div className="tab-title">Danh sách sinh viên</div>
                <div className="table_1">
                  <CustomTable
                    columns={[
                      "Mã sinh viên",
                      "Họ tên",
                      "Lớp",
                      "Khoa",
                      "Chọn",
                      "Thao tác",
                    ]}
                    data={students.map((item) => ({
                      mã_sinh_viên: item.student_number,
                      họ_tên: item.full_name,
                      lớp: item.class_id?.name || "-",
                      khoa: item.falcuty_name || "-",
                      chọn: <input type="checkbox" key={item.studentId} />,
                      thao_tác: (
                        <button
                          className="xct"
                          onClick={() =>
                            navigate(`/student-infor/${item.user_id?._id}`)
                          }
                        >
                          Xem chi tiết
                        </button>
                      ),
                    }))}
                  />
                </div>
              </>
            )}

            {activeTab === "teacher" && (
              <>
                <div className="tab-title">Danh sách cán bộ, giảng viên</div>
                <div className="table_1">
                  <CustomTable
                    columns={[
                      "Mã giảng viên",
                      "Họ tên",
                      "Đơn vị",
                      "Chức vụ",
                      "Chọn",
                      "Thao tác",
                    ]}
                    data={teachers.map((item) => ({
                      mã_giảng_viên: item.staff_number,
                      họ_tên: item.full_name,
                      đơn_vị: item.org_unit_id?.name,
                      chức_vụ: item.org_unit_id?.name,
                      chọn: <input type="checkbox" key={item.teacherId} />,
                      thao_tác: (
                        <button
                          className="xct"
                          onClick={() =>
                            navigate(`/teacher-infor/${item.teacherId}`)
                          }
                        >
                          Xem chi tiết
                        </button>
                      ),
                    }))}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserAccount_Management;
