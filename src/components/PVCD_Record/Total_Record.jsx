import "./Total_Record.css";
function Total_Record({ score=50 ,num_activity=10}) {
    return (
    <div className="score-box">
      <p>Tổng điểm tích lũy</p>
      <h2>{score} điểm</h2>
      <p>Bạn đã tham gia: <strong>{num_activity} hoạt động</strong></p>
    </div>
  );
}

export default Total_Record;