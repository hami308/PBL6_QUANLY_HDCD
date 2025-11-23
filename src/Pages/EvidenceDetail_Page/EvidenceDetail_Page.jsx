import Header  from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import EvidenceDetail  from "../../components/Student/EvidenceDetails/EvidenceDetails.jsx"; 
import Footer from "../../components/Footer/Footer.jsx";

function EvidenceDetail_Page(){
    return(
        <>
            <Header/>
            <Menu_org />
            <EvidenceDetail />
            <Footer />
        </>
    );
}
export default EvidenceDetail_Page;