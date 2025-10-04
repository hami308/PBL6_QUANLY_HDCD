import "./Year_Record.css";
function Year_Record({record=10,year=1, goal_record=15}) {
    let status;
    if(record>=goal_record) status="Đạt";
    else status="Chưa đạt";
    return (
        <div className="year-card">
            <span className="status" style={{ background: status === "Đạt" ? "#42E694" : "#F69898" }}>{status}</span>
            <h4>Năm {year}</h4>
            <p >2025-2026</p>
            <span ><strong>{record} điểm</strong></span>
        </div>
    );
}
export default Year_Record; 
