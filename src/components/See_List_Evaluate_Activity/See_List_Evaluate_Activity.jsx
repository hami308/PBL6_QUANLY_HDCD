import React from "react";
import See_Evaluate_Activity from "./See_Evaluate_Activity"; 
import "./See_List_Evaluate_Activity.css";

export default function See_List_Evaluate_Activity({ reviews }) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="review-section">
      <div className="review-section-title"> 
        <h3 >Nhận xét, đánh giá từ sinh viên</h3>
      </div>
      {safeReviews.length === 0 ? (
        <p className="no-reviews">Chưa có sinh viên nào đánh giá hoạt động</p>
      ) : (
        safeReviews.map((item, index) => (
          <See_Evaluate_Activity key={index} {...item} />
        ))
      )}
    </div>
  );
}

