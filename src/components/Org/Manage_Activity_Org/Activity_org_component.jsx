import "./Activity_org_component.css";
function Activity_Org_Component({activity}) {
  return (
   <div className="activity-org-component-card">
        <div className="activity-org-component-left">
            <img src={activity.image} alt={activity.name} className="activity-org-component-image"/>           
            <div className="activity-org-component-text-content">
                <h2 className="activity-org-component-title">{activity.name}</h2>
                <span className="activity-org-component-club">{activity.org}</span>
                <p className="activity-org-component-info">Thời gian: {activity.date}</p>
                <p className="activity-org-component-info">Địa điểm: {activity.location}</p>
            </div>
        </div>    
        <div className="activity-org-component-right">
            <div className="activity-org-component-status">{activity.status}</div>
            <span className="material-symbols-outlined menu-icon">
                menu
            </span>
        </div>
    </div>
  );
}
export default Activity_Org_Component;
