import React, { useState, useEffect } from "react";
import Activity_org_component from "./Activity_org_component";
import Pagination from "../../Pagination/Pagination";
import Activity_pic from "../../../assets/images/activity.jpg";
import { get_activities_by_orgunit } from "../../../services/Activity_Services";
import { getStaffInfo } from "../../../services/Staff_Service"; 

function List_Activity_org_component() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const user = JSON.parse(sessionStorage.getItem("user"));
        //  1. Lấy user từ sessionStorage
        if (!user) throw new Error("Không tìm thấy thông tin. Vui lòng đăng nhập");

        //  2. Gọi API lấy thông tin staff
        const staff = await getStaffInfo(user.id);
        if (!staff) throw new Error("Không thể lấy thông tin staff.");

        //  3. Lấy org_unit_id từ staff
        const orgUnitId = staff.org_unit_id;
        if (!orgUnitId) throw new Error("Staff không thuộc tổ chức nào.");

        //  4. Gọi API lấy danh sách hoạt động theo tổ chức
        const actRes = await get_activities_by_orgunit(orgUnitId);
        if (actRes.success && Array.isArray(actRes.data)) {
          const withImages = actRes.data.map((item) => ({
            ...item,
            image: item.image || Activity_pic,
          }));
          setActivities(withImages);
        } else {
          throw new Error(actRes.message || "Không thể tải danh sách hoạt động.");
        }
      } catch (err) {
        console.error("Fetch activities error:", err);
        setError(err.message || "Lỗi kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //  Phân trang
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  //  Hiển thị
  if (loading) return <p style={{ textAlign: "center" }}> Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="list-activity-org-component-container">

      {currentActivities.length > 0 ? (
        currentActivities.map((activity) => (
          <Activity_org_component key={activity._id || activity.id} activity={activity} />
        ))
      ) : (
        <p style={{ textAlign: "center" }}>Không có hoạt động nào.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default List_Activity_org_component;
