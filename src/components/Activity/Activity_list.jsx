import React, { useState, useEffect } from "react";
import { get_all_activities } from "../../services/Activity_Services.js"; 
import Activity from "./Activity.jsx";
import "./Activity_list.css";
import Pagination from "../Pagination/Pagination.jsx";
import activity_pic from "../../assets/images/activity.jpg";

function Activity_list() {
  const [activities, setActivities] = useState([]); // dữ liệu từ API
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerRow = 4;  // số cột
  const rowsPerPage = 3;  // số hàng
  const itemsPerPage = itemsPerRow * rowsPerPage; // = 12

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await get_all_activities();
      if (result.success) {
       setActivities(result.data.data);
        setError("");
      } else {
        setError(result.message);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (error) return <p className="error"> {error}</p>;
  if (activities.length === 0) return <p>Không có hoạt động nào.</p>;

  return (
    <div>
      <div className="activity-list">
        {currentActivities.map((activity) => (
          <Activity
            key={activity._id} // key duy nhất
            id={activity._id}
            image={activity.activity_image || activity_pic} // ảnh mặc định nếu không có
            name={activity.title} // từ API là 'title'
            volunteers={activity.capacity || 0} // số lượng tình nguyện viên hiện tại
            org={activity.org_unit_id?.name || "Không rõ đơn vị"}
            time_org_start={activity.start_time}
            time_org_end={activity.end_time}
          />
        ))}
      </div>

      {/* Thanh phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Activity_list;
