import React from "react";
import See_Evaluate_Activity from "./See_Evaluate_Activity"; 
import "./See_List_Evaluate_Activity.css";

export default function See_List_Evaluate_Activity() {
  const reviews = [
    {
      name_student: "Nguyễn Văn A",
      content:
        "Hoạt động rất ý nghĩa, được các anh chị tình nguyện viên hướng dẫn rất tận tình. Hi vọng sẽ có nhiều chương trình như thế này hơn nữa.",
      date: "20/5/2023",
      name_activity: "Hiến máu nhân đạo",
      time_org_start: "8:00 19/5/2023",
      time_org_end:"11:00 19/5/2023",
      rating: 5,
    },
    {
      name_student: "Trần Thị B",
      content:
        "Chương trình rất bổ ích, tổ chức chuyên nghiệp và thân thiện. Mình rất vui vì được tham gia.",
      date: "21/5/2023",
      name_activity: "Tình nguyện mùa hè xanh",
      time_org_start: "8:00 19/5/2023",
      time_org_end:"11:00 19/5/2023",
      rating: 4,
    },
  ];

  return (
    <div className="review-section">
      <h3 className="review-section-title">Nhận xét, đánh giá từ sinh viên</h3>

      {reviews.map((item, index) => (
        <See_Evaluate_Activity
          key={index}
          {...item}
        />
      ))}
    </div>
  );
}
