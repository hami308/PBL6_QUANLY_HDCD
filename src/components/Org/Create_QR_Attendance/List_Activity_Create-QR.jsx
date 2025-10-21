import Create_QR_Attendance from "./Create_QR_Attendance";
import Pagination from "../../Pagination/Pagination";
import React, { useState } from "react";
import Activity_pic from '../../../assets/images/activity.jpg';
import "./List_Activity_Create_QR.css";

  const activity_list = [
    {
      name: 'Hiến máu nhân đạo',
      org: 'Câu lạc bộ Công tác xã hội',
      time_org_start: '2025-09-15',
      time_org_end: '2025-09-15',
      location: 'Khu B ĐHBK',
      image: Activity_pic,
    },
    {
      name: 'Dọn rác bờ sông',
      org: 'Câu lạc bộ Môi trường Xanh',
      time_org_start: '2025-10-22',
      time_org_end: '2025-10-22',
      location: 'Công viên Lê Văn Tám',
      image: Activity_pic,
    },
    {
      name: 'Tặng quà Trung Thu',
      org: 'Câu lạc bộ Tình nguyện',
      time_org_start: '2025-09-10',
      time_org_end: '2025-09-10',
      location: 'Nhà văn hóa Thanh Niên',
      image: Activity_pic,
    },
    {
      name: 'Hiến máu nhân đạo',
      org: 'Câu lạc bộ Công tác xã hội',
      time_org_start: '2025-09-15',
      time_org_end: '2025-09-15',
      location: 'Khu B ĐHBK',
      image: Activity_pic,
    },
    {
      name: 'Dọn rác bờ sông',
      org: 'Câu lạc bộ Môi trường Xanh',
      time_org_start: '2025-10-22',
      time_org_end: '2025-10-22',
      location: 'Công viên Lê Văn Tám',
      image: Activity_pic,
    },
    {
      name: 'Tặng quà Trung Thu',
      org: 'Câu lạc bộ Tình nguyện',
      time_org_start: '2025-09-10',
      time_org_end: '2025-09-10',
      location: 'Nhà văn hóa Thanh Niên',
      image: Activity_pic,
    },
  ];

function List_Activity_Create_QR(){
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
        <>
            <div className="search-activity-create-qr">
              <input placeholder="Tìm kiếm hoạt động..." name="search-activity-name"></input>
              <button>Tìm kiếm</button>
            </div>
            {currentActivities.map((activity, index) => (
                <Create_QR_Attendance
                    key={index} 
                    activity={activity}
                />
            ))}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
}
export default List_Activity_Create_QR;