import React, { useState } from "react";
import Activity_propose from "./Activity_propose";
import Pagination from "../../Pagination/Pagination"; 
import { activity_list } from "../../../data/activity_list";
import "./List_Activity_prpose.css";

export default function List_Activity_propose() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số hoạt động mỗi trang

  // Tính toán chỉ mục hiển thị
  const totalPages = Math.ceil(activity_list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activity_list.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Hàm xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
    }
  };

  return (
    <div className="activity-propose-container">
      <div className="filter-sort-propose-activity-container">
        <select name="status-activity-propose" className="status-filter-activity-propose">
            <option value="" disabled> Chọn tình trạng</option>
            <option value="Đang chờ duyệt">Đã duyệt</option>
            <option value="Đã duyệt">Chưa duyệt</option>
        </select>

        <select
              className="sort-select-activity-propose"
              style={{ marginLeft: 12 }}
        >
            <option value="" disabled>--Sắp xếp --</option>
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
        </select>
      </div>
      <div className="activity-propose-list">
        {currentActivities.map((activity) => (
          <Activity_propose key={activity.id} activity={activity} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
