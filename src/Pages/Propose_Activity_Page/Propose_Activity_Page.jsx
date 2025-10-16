import Header from "../../components/Header/Header";
import Menu_Org from "../../components/Menu/Menu_student";
import Propose_Activity from "../../components/Org/Propose_Activity/Propose_Activity";
import "./Propose_Activity_Page.css"
function Propose_Activity_Page (){
    return(
        <>
            <Header/>
            <Menu_Org/>         
            <Propose_Activity/>
            
        </>
    );
}
export default Propose_Activity_Page;