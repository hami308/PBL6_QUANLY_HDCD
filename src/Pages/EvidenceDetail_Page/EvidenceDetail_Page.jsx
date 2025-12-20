import Header  from "../../components/Header/Header";
import Menu_org from "../../components/Menu/Menu_org.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import EvidenceDetail  from "../../components/Student/EvidenceDetails/EvidenceDetails.jsx"; 
import Footer from "../../components/Footer/Footer.jsx";

function EvidenceDetail_Page(){
    const role = sessionStorage.getItem("role");
    return(
        <>
            <Header/>
            {role === "student" ? <Menu_student /> : <Menu_org />}
            <EvidenceDetail />
            <Footer />
        </>
    );
}
export default EvidenceDetail_Page;