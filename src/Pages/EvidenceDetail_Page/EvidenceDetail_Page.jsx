import Header  from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import EvidenceDetail  from "../../components/Student/EvidenceDetails/EvidenceDetails.jsx"; 
import Footer from "../../components/Footer/Footer.jsx";

function EvidenceDetail_Page(){
    return(
        <>
            <Header/>
            <Menu_student />
            <EvidenceDetail />
            <Footer />
        </>
    );
}
export default EvidenceDetail_Page;