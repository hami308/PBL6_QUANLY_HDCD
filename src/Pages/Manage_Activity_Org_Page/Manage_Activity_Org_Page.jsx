import { useState } from "react";
import Header from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_org";
import Filter_Activity from "../../components/Activity/Filter_activity";
import Footer from "../../components/Footer/Footer";
import "./Manage_Activity_Org_Page.css";
import List_Activity_org_component from "../../components/Org/Manage_Activity_Org/List_Activity_org_component";
import { status_activity } from "../../data/status";

function Manage_Activity_Org_Page() {
  const [filters, setFilters] = useState({});

  return (
    <div className="manage-activity-org-page">
      <Header />
      <Menu_org />
      <div className="background-image-manage-activity-org"></div>

      <Filter_Activity
        status={status_activity}
        onFilter={setFilters}  
      />

      <List_Activity_org_component
        filters={filters}   
      />

      <Footer />
    </div>
  );
}

export default Manage_Activity_Org_Page;
