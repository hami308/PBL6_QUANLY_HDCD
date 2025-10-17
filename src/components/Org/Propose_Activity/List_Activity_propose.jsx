import React, { useState } from "react";
import Activity_propose from "./Activity_propose";
import Pagination from "../../Pagination/Pagination"; // Đường dẫn bạn thay theo đúng vị trí file Pagination
import { activity_list } from "../../../data/activity_list";

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
