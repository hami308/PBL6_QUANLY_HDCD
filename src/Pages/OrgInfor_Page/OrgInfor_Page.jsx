import Header from "../../components/Header/Header";
import Infor from "../../components/Org/Information/Infor";
import Footer from "../../components/Footer/Footer";
import Menu_org from "../../components/Menu/Menu_org";
import "./OrgInfor_Page.css";

const OrgInfor_Page = () => {
  return (
    <div className="org-infor-page">
      <Header />
      <Menu_org />
      <Infor />
      <Footer />
    </div>
  );
};

export default OrgInfor_Page;
