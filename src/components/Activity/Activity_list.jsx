import React, { useState, useEffect } from "react";
import Activity from "./Activity.jsx";
import "./Activity_list.css";
import Pagination from "../Pagination/Pagination.jsx";
import activity_pic from "../../assets/images/activity.jpg";
import { get_all_activities, filter_activities } from "../../services/Activity_Services.js"; // Thêm import

function Activity_list({ filters = {} }) { // Nhận filters từ props
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerRow = 4;
  const rowsPerPage = 3;
  const itemsPerPage = itemsPerRow * rowsPerPage;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      
      let result;
      if (Object.keys(filters).length === 0) {
        // Nếu không có filter, lấy tất cả activities
        result = await get_all_activities();
      } else {
        // Nếu có filter, gọi API filter
        result = await filter_activities(filters);
      }
      
      if (result.success) {
        setActivities(result.data.data || result.data);
        setError("");
      } else {
        setError(result.message);
        setActivities([]);
      }
      setLoading(false);
    }

    fetchData();
  }, [filters]); // Thêm filters vào dependency

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  // Reset về trang 1 khi filters thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="error"> {error}</p>;
  if (activities.length === 0) return <p>Không có hoạt động nào.</p>;

  return (
    <div>
      <div className="activity-list">
        {currentActivities.map((activity) => (
          <Activity
            key={activity._id}
            id={activity._id}
            image={activity.activity_image || activity_pic}
            name={activity.title}
            volunteers={activity.capacity || 0}
            org={activity.org_unit_id?.name || "Không rõ đơn vị"}
            time_org_start={activity.start_time}
            time_org_end={activity.end_time}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Activity_list;