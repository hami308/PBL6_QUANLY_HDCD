import React from "react";
import "./See_Evaluate_Activity.css";
import {useState} from "react";
export default function See_Evaluate_Activity(evaluate_activity_details) {

   const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  return (
    <div className="see-evaluate-container">
      <div className="see-evaluate-card">
        <div className="see-evaluate-header">
          <div className="see-evaluate-tags">
            <span className="activity-name">
              {evaluate_activity_details.name_activity}
            </span>
            <span className="activity-date">
              {evaluate_activity_details.time_org_start} - {evaluate_activity_details.time_org_end}
            </span>
          </div>

          <div className="see-evaluate-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < evaluate_activity_details.rating
                    ? "star active"
                    : "star inactive"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <h3 className="see-evaluate-name">
          {evaluate_activity_details.name_student}
        </h3>
        <p
          className={`see-evaluate-comment ${
            expanded ? "expanded" : "collapsed"
          }`}
        >
          {evaluate_activity_details.content}
        </p>

        {evaluate_activity_details.content.length > 150 && (
          <span className="toggle-btn" onClick={toggleExpanded}>
            {expanded ? "Thu gọn" : "Xem thêm"}
          </span>
        )}

        <div className="see-evaluate-date">
          Đăng ngày: {evaluate_activity_details.date}
        </div>
      </div>
    </div>
  );
}
