import Header from "../../Components/Header/Header";
import Menu_org from "../../Components/Menu/Menu_student";
import Filter_Activity from "../../components/Activity/Filter_activity";
import Footer from "../../Components/Footer/Footer";
import "./Manage_Activity_Org_Page.css";
import List_Activity_org_component from "../../components/Org/Manage_Activity_Org/List_Activity_org_component";
function Manage_Activity_Org_Page() {
  return (
    <div className="manage-activity-org-page">
      <Header />
      <Menu_org />
      <div className="background-image-manage-activity-org">
      </div>
      <div className="cross-bar">
        <p>Danh sách các hoạt động</p>
      </div>
      <Filter_Activity />
      <List_Activity_org_component />
      <Footer />
    </div>
  );
}
export default Manage_Activity_Org_Page;