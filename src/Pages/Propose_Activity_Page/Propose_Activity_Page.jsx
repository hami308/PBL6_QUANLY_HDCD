import Header from "../../components/Header/Header";
import Menu_Org from "../../components/Menu/Menu_student";
import Propose_Activity from "../../components/Org/Propose_Activity/Propose_Activity";
import Footer from "../../components/Footer/Footer";
import List_Activity_propose from "../../components/Org/Propose_Activity/List_Activity_propose";
function Propose_Activity_Page (){
    return(
        <>
            <Header/>
            <Menu_Org/>         
            <Propose_Activity/>
            <div className="cross-bar">
                <p>Danh sách các hoạt động đã đề xuất</p>
            </div>
            <List_Activity_propose/>
            <Footer/>
        </>
    );
}
export default Propose_Activity_Page;