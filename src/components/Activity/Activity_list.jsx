import { activity_list } from '../../../data/activity_list.js';
import Activity from './Activity.jsx';
import './Activity_list.css';
import React, { useState } from 'react';
import Pagination from '../Pagination/Pagination.jsx';

function Activity_list() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerRow = 4;  // số cột
  const rowsPerPage = 3;  // số hàng
  const itemsPerPage = itemsPerRow * rowsPerPage; // = 12

  const totalPages = Math.ceil(activity_list.length / itemsPerPage);

  // Tính vị trí bắt đầu & kết thúc
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activity_list.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="activity-list">
        {currentActivities.map(activity => (
          <Activity
            key={activity.id}
            id={activity.id}
            image={activity.image}
            name={activity.name}
            volunteers={activity.volunteers}
            org={activity.org}
            time_org={activity.time_org}
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
