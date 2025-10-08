import Header from "../../components/Header/Header";
import Filter_Admin from "../../components/Filter_Admin/Filter_Admin";
import MenuAdmin from "../../components/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable";
import React from "react";
import "./UserAccount_Management.css";
function UserAccount_Management() {
  const [activeTab, setActiveTab] = React.useState("student");
  const [showDeleteOptions, setShowDeleteOptions] = React.useState(false);

  const students = [
    {
      studentId: "102200001",
      name: "Nguyễn Văn A",
      class: "KTPM01",
      faculty: "Công nghệ thông tin",
    },
    {
      studentId: "102200002",
      name: "Trần Thị B",
      class: "QTKD02",
      faculty: "Hóa",
    },
    {
      studentId: "102200003",
      name: "Lê Văn C",
      class: "KT01",
      faculty: "Kế toán",
    },
    {
      studentId: "102200004",
      name: "Phạm Thị D",
      class: "CK03",
      faculty: "Cơ khí",
    },
    {
      studentId: "102200005",
      name: "Hoàng Văn E",
      class: "XD02",
      faculty: "Xây dựng",
    },
    {
      studentId: "102200005",
      name: "Hoàng Văn E",
      class: "XD02",
      faculty: "Xây dựng",
    },
    {
      studentId: "102200005",
      name: "Hoàng Văn E",
      class: "XD02",
      faculty: "Xây dựng",
    },
    {
      studentId: "102200005",
      name: "Hoàng Văn E",
      class: "XD02",
      faculty: "Xây dựng",
    },
    {
      studentId: "102200005",
      name: "Hoàng Văn E",
      class: "XD02",
      faculty: "Xây dựng",
    },
  ];

  const teachers = [
    {
      teacherId: "GV001",
      name: "Nguyễn Văn T",
      unit: "Khoa CNTT",
      position: "Trưởng khoa",
    },
    {
      teacherId: "GV002",
      name: "Trần Thị H",
      unit: "Khoa Kinh tế",
      position: "Giảng viên",
    },
    {
      teacherId: "GV003",
      name: "Lê Minh K",
      unit: "Khoa Cơ khí",
      position: "Phó trưởng khoa",
    },
    {
      teacherId: "GV004",
      name: "Phạm Thị L",
      unit: "Khoa Kế toán",
      position: "Giảng viên",
    },
    {
      teacherId: "GV005",
      name: "Hoàng Đức M",
      unit: "Khoa Xây dựng",
      position: "Trưởng bộ môn",
    },
  ];

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

        {activeTab === "student" && (
          <div className="tab-title">Danh sách sinh viên</div>
        )}
        {activeTab === "teacher" && (
          <div className="tab-title">Danh sách cán bộ, giảng viên</div>
        )}
        {activeTab === "student" && (
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
              mã_sinh_viên: item.studentId,
              họ_tên: item.name,
              lớp: item.class,
              khoa: item.faculty,
              chọn: <input type="checkbox" key={item.studentId} />,
              thao_tác: (
                <button className="px-2 py-1 border rounded">
                  Xem chi tiết
                </button>
              ),
            }))}
          />
        )}

        {activeTab === "teacher" && (
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
              mã_giảng_viên: item.teacherId,
              họ_tên: item.name,
              đơn_vị: item.unit,
              chức_vụ: item.position,
              chọn: <input type="checkbox" key={item.teacherId} />,
              thao_tác: (
                <button className="px-2 py-1 border rounded">
                  Xem chi tiết
                </button>
              ),
            }))}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserAccount_Management;
