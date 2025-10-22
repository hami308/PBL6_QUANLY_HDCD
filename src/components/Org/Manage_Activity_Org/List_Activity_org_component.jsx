import Activity_org_component from "./Activity_org_component";
import Pagination from "../../Pagination/Pagination";
import React, { useState } from "react";
import Activity_pic from '../../../assets/images/activity.jpg';

  const activity_list = [
    {
        id: 1,
      name: "Hiến máu nhân đạo",
      org: "CLB Công tác xã hội",
      date: "15/9/2025",
      location: "Khu B ĐHBK",
      status: "Chưa diễn ra",
        image: Activity_pic,
    },
    {
      id: 2,
      name: "Ngày hội Sách và Tri thức",
      org: "CLB Kỹ năng mềm",
      date: "22/10/2025",
      location: "Thư viện trường",
      status: "Đang diễn ra",
        image: Activity_pic,
    },
    {
      id: 3,
      name: "Giải bóng đá sinh viên",
      org: "Đoàn khoa CNTT",
      date: "30/10/2025",
      location: "Sân vận động KTX",
      status: "Đã kết thúc",    
        image: Activity_pic,
    },
    {
     id: 1,
      name: "Hiến máu nhân đạo",
      org: "CLB Công tác xã hội",
      time_org_start: "15/9/2025",
      location: "Khu B ĐHBK",
      status: "Chưa diễn ra",
      image: Activity_pic,
    },
    {
      id: 2,
      name: "Ngày hội Sách và Tri thức ",
      org: "CLB Kỹ năng mềm",
      date: "22/10/2025",
      location: "Thư viện trường",
      status: "Đang diễn ra",
        image: Activity_pic,
    },
    {
      id: 3,
      name: "Giải bóng đá sinh viên",
      org: "Đoàn khoa CNTT",
      date: "30/10/2025",
      location: "Sân vận động KTX",
      status: "Đã kết thúc",
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
            {currentActivities.map((activity, index) => (
                <Activity_org_component
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