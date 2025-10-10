import "./Activity_Details.css";
function Activity_Details({activity_details,ismodify}){
    return(
        <div className="activity-card-details">
        <div className="activity--details">
          <h1 className="activity-title-details">{activity_details.name}</h1>
          <button className="join-btn">Đăng ký tham gia</button>
        </div>
        <div className="activity-team-details">{activity_details.org}</div>
        <img src={activity_details.image} alt={activity_details.name} className="activity-image-details"/>

        <div className="activity-content-details">
          <div className="field">
            <p>Mô tả:</p>
            <span value={activity_details.description} className="activity-span-details" ismodify={ismodify} />
            
          </div>

          <div className="field">
            <p>Thời gian đăng ký:</p>
            <span value={activity_details.register_time} className="activity-span-details" ismodify={ismodify} />
          </div>

          <div className="field">
            <p>Số lượng đã đăng ký:</p>
            <span value={activity_details.register_count} className="activity-span-details" ismodify={ismodify} />
          </div>

          <div className="field">
            <p>Thời gian tổ chức:</p>
            <span value={activity_details.time_org} className="activity-span-details" ismodify={ismodify} />
          </div>

          <div className="field">
            <p>Số lượng tình nguyện viên cần:</p>
            <span value={`${activity_details.volunteers}`} className="activity-span-details" ismodify={ismodify} />
          </div>

          <div className="field">
            <p>Địa điểm:</p>
            <span value={activity_details.location} className="activity-span-details" ismodify={ismodify} />
          </div>

          <div className="field">
            <p>Lĩnh vực:</p>
            <span value={activity_details.field} className="activity-span-details" ismodify={ismodify} />
          </div>

          <div className="field">
            <p>Yêu cầu theo khóa:</p>
            {/* <TagSelect 
              options={courseOptions} 
              value={courseValuesState} 
              onChange={setCourseValuesState}
              className="activity-tag-select"
              readOnly={true}  // student = readonly, org = chỉnh sửa
            /> */}

          </div>

          <div className="field">
            <p>Yêu cầu theo khoa:</p>
            {/* <TagSelect 
              options={facultyOptions} 
              value={facultyValuesState} 
              onChange={setFacultyValuesState}
              className="activity-tag-select"
              readOnly={false}  // student = readonly, org = chỉnh sửa
            /> */}
          </div>
        </div>
      </div>
    );
}
export default Activity_Details;