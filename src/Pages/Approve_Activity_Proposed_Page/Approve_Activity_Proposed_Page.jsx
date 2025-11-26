// Approve_Activity_Proposed_Page.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_org";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import CancelActivityPopup from "../../components/Popup/CancelActivityPopup.jsx";
import { get_all_org } from "../../services/Org_Service.js";
import { filter_activities, approve_activity, reject_activity } from "../../services/Activity_Services.js";
import dayjs from "dayjs";
import "./Approve_Activity_Proposed_Page.css";
import { useNavigate } from "react-router-dom";

function Approve_Activity_Proposed_Page() {
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const [orgList, setOrgList] = useState([]);
  const [activities, setActivities] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectActivityId, setRejectActivityId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrgList();
    fetchActivities();
  }, []);

  const fetchOrgList = async () => {
    try {
      const res = await get_all_org();
      const data = res?.data?.data || res?.data || [];
      setOrgList(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách tổ chức:", error);
    }
  };

  const fetchActivities = async (orgId = "") => {
    try {
      const filters = {
        status: "chờ duyệt",
        field_id: null,
        title: null,
        org_unit_id: orgId === "all" ? null : orgId || null,
      };
      const res = await filter_activities(filters);
      const data = res?.data?.data || res?.data || [];
      setActivities(data);
      setNoDataMessage(data.length === 0 ? "Không có hoạt động nào phù hợp." : "");
    } catch (error) {
      console.error("Lỗi lấy hoạt động:", error);
    }
  };

  const handleOrgChange = (orgId) => {
    setSelectedOrg(orgId);
    fetchActivities(orgId);
  };

  const handleApprove = async (activityId) => {
    if (!window.confirm("Bạn có chắc muốn duyệt hoạt động này?")) return;
    const res = await approve_activity(activityId);
    if (res.success) {
      alert("Duyệt hoạt động thành công!");
      fetchActivities(selectedOrg);
    } else {
      alert(res.message);
    }
  };

  const handleReject = (activityId) => {
    setRejectActivityId(activityId);
    setShowRejectPopup(true);
  };
  const goToDetails = (id) => {
    navigate(`/activity-details/${id}`);
  };
  const handleConfirmReject = async (reason) => {
    if (!rejectActivityId) return;
    const res = await reject_activity(rejectActivityId, reason);
    if (res.success) {
      alert("Từ chối hoạt động thành công!");
      fetchActivities(selectedOrg);
    } else {
      alert(res.message);
    }
    setShowRejectPopup(false);
    setRejectActivityId(null);
  };

  const formatDateTime = (iso) => (iso ? dayjs(iso).format("DD/MM/YYYY HH:mm") : "");

  const sortedActivities = [...activities].sort((a, b) => {
    if (selectDate === "newest") return dayjs(b.submittedAt).unix() - dayjs(a.submittedAt).unix();
    if (selectDate === "oldest") return dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix();
    return 0;
  });

  const columns = [
    "STT",
    "Tên hoạt động",
    "Tổ chức",
    "Thời gian tổ chức",
    "Địa điểm",
    "Ngày đề xuất",
    "Thao tác",
  ];

  const tableData = sortedActivities.map((item, index) => ({
    stt: index + 1,
    tên_hoạt_động: item?.title,
    tổ_chức: item?.org_unit_id?.name,
    thời_gian_tổ_chức: `${formatDateTime(item.start_time)} - ${formatDateTime(item.end_time)}`,
    địa_điểm: item?.location,
    ngày_đề_xuất: formatDateTime(item?.submittedAt),
    actions: item?._id,
    id: item?._id,
  }));

  const renderActions = (row) => (
    <div className="custom-table__actions">
      <button className="approve-btn" onClick={() => handleApprove(row.actions)}>Duyệt</button>
      <button className="reject-btn" onClick={() => handleReject(row.actions)}>Từ chối</button>
     <button className="detail-btn" onClick={() => goToDetails(row.id)}>Chi tiết</button>
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

      {/* Bộ lọc */}
      <div className="filter-section">
        <select value={selectedOrg} onChange={(e) => handleOrgChange(e.target.value)} className="filter-select">
          <option value="" disabled>--Chọn tổ chức--</option>
          <option value="all">Tất cả</option>
          {orgList.map((item) => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>

        <select value={selectDate} onChange={(e) => setSelectDate(e.target.value)} className="filter-select">
          <option value="" disabled>--Sắp xếp--</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {/* Thông báo nếu không có dữ liệu */}
      {noDataMessage && <p style={{ textAlign: "center", marginTop: "10px", color: "red" }}>{noDataMessage}</p>}

      {/* Bảng */}
      {!noDataMessage && (
        <div className="table-list-container">
          <CustomTable columns={columns} data={tableData} renderActions={renderActions} />
        </div>
      )}

      {/* Popup từ chối */}
      {showRejectPopup && (
        <CancelActivityPopup
          onClose={() => setShowRejectPopup(false)}
          onConfirm={handleConfirmReject}
        />
      )}

      <Footer />
    </div>
  );
}

export default Approve_Activity_Proposed_Page;
