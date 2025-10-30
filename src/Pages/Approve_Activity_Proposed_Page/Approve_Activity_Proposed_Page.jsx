import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_student";
import Footer from "../../components/Footer/Footer";
import "./Approve_Activity_Proposed_Page.css";
import { org } from "../../data/org.js";
import CustomTable from "../../components/Custom/CustomTable.jsx";

function Approve_Activity_Proposed_Page() {
  const [activeTab, setActiveTab] = useState("activity-not-yet-approved");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectDate, setSelectDate] = useState("");

  //  DỮ LIỆU MẪU: Gồm cả hoạt động chưa xử lý & đã xử lý
  const activities = [
    {
      id: 1,
      name: "Hiến máu nhân đạo",
      organization: "CLB Công tác xã hội",
      date: "15/9/2025",
      location: "Khu B ĐHBK",
      submittedAt: "07/9/2025",
      status: "Đã duyệt",
    },
    {
      id: 2,
      name: "Trồng cây gây rừng",
      organization: "CLB Môi trường xanh",
      date: "10/10/2025",
      location: "Công viên phần mềm Quang Trung",
      submittedAt: "01/10/2025",
      status: "Từ chối",
    },
    {
      id: 3,
      name: "Ngày hội thể thao sinh viên",
      organization: "Phòng Công tác sinh viên",
      date: "20/11/2025",
      location: "Sân vận động ĐHBK",
      submittedAt: "15/10/2025",
      status: "", // chưa xử lý
    },
    {
      id: 4,
      name: "Cuộc thi Sáng tạo trẻ",
      organization: "Đoàn khoa Cơ khí",
      date: "05/12/2025",
      location: "Hội trường A5",
      submittedAt: "22/10/2025",
      status: "", // chưa xử lý
    },
    {
      id: 5,
      name: "Tình nguyện mùa hè xanh",
      organization: "CLB Thanh niên tình nguyện",
      date: "01/8/2025",
      location: "Tỉnh Bình Phước",
      submittedAt: "25/7/2025",
      status: "", // chưa xử lý
    },
  ];

  //  Lọc dữ liệu theo tab (chưa xử lý / đã xử lý)
  const filteredActivities =
    activeTab === "activity-not-yet-approved"
      ? activities.filter((a) => !a.status || a.status === "")
      : activities.filter((a) => a.status && a.status !== "");

  //  Cột của bảng
  const columns =
    activeTab === "activity-not-yet-approved"
      ? ["STT", "Tên hoạt động", "Tổ chức", "Thời gian", "Địa điểm", "Ngày đề xuất"]
      : [
          "STT",
          "Tên hoạt động",
          "Tổ chức",
          "Thời gian",
          "Địa điểm",
          "Ngày đề xuất",
          "Trạng thái",
        ];

  //  Chuẩn hóa dữ liệu cho bảng
  const tableData = filteredActivities.map((item, index) => {
    const base = {
      stt: index + 1,
      tên_hoạt_động: item.name,
      tổ_chức: item.organization,
      thời_gian: item.date,
      địa_điểm: item.location,
      ngày_đề_xuất: item.submittedAt,
    };

    if (activeTab === "activity-approved") {
      base.trạng_thái = (
        <span >
          {item.status}
        </span>
      );
    }
    return base;
  });

  //  Nút thao tác tùy theo tab
 const renderActions = () => (
  <div className="custom-table__actions">
    {activeTab === "activity-not-yet-approved" ? (
      <>
        <button className="approve-btn">Duyệt</button>
        <button className="reject-btn">Từ chối</button>
        <button className="detail-btn">Chi tiết</button>
      </>
    ) : (
      <button className="detail-btn">Chi tiết</button>
    )}
  </div>
);


  return (
    <div className="approve-activity-proposed-page">
      <Header />
      <Menu_org />
      <div className="background-page"></div>

      <div className="cross-bar">
        <p>Danh sách các hoạt động đề xuất</p>
      </div>

      {/* Tabs */}
      <div className="management-tabs">
        <button
          className={
            activeTab === "activity-not-yet-approved" ? "tab_active" : "tab"
          }
          onClick={() => setActiveTab("activity-not-yet-approved")}
        >
          Chưa xử lý
        </button>
        <button
          className={activeTab === "activity-approved" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("activity-approved")}
        >
          Đã xử lý
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="filter-section">
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="filter-select"
        >
          <option value="">Chọn tổ chức</option>
          {org.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
          className="filter-select"
        >
          <option value="">Sắp xếp</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>

      </div>

      {/* Bảng hiển thị */}
      <div className="table-list-container">
        <CustomTable
          columns={columns}
          data={tableData}
          renderActions={renderActions}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Approve_Activity_Proposed_Page;
