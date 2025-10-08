import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student.jsx";
import Filter_activity from "../../components/Activity/Filter_activity.jsx";
import "./ManageActivity_Student_Page.css";
import List_ManageActivity_Student from "../../components/Student/ManageActivity_Student/List_ManageActivity_Student.jsx";
import Footer from "../../components/Footer/Footer.jsx";
function ManageActivity_Student_Page(){
    return(
        <>
            <Header/>
            <Menu_student/>
            <div className="manage-activity-student-background">
            </div>
            <div className="filter-activity-student">
                <Filter_activity/>
            </div>
            <List_ManageActivity_Student />
            <Footer/>
        </>
    );
}
export default ManageActivity_Student_Page