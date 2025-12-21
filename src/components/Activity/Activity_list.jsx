import React, { useState, useEffect, useMemo } from "react";
import Activity from "./Activity.jsx";
import "./Activity_list.css";
import Pagination from "../Pagination/Pagination.jsx";
import activity_pic from "../../assets/images/activity.jpg";
import { filter_activities } from "../../services/Activity_Services.js";

function Activity_list({ filters = null }) {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerRow = 4;
  const rowsPerPage = 3;
  const itemsPerPage = itemsPerRow * rowsPerPage;

  //  Luôn đảm bảo có post: true
const finalFilters = useMemo(() => {
  return {
    ...(filters || {}),
    post_status: true, 
  };
}, [JSON.stringify(filters)]);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await filter_activities(finalFilters);

        if (result.success) {
          setActivities(result.data.data || result.data);
        } else {
          setError(result.message || "Có lỗi xảy ra");
          setActivities([]);
        }
      } catch (err) {
        console.error("Lỗi tải hoạt động:", err);
        setError("Không thể tải dữ liệu");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [finalFilters]);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [finalFilters]);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) return <p className="error">{error}</p>;
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
