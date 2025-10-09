import "./Approved_Evidence_Page.css";
import Header from "../../components/Header/Header.jsx";
import Menu_student from "../../components/Menu/Menu_student";
import Footer from "../../components/Footer/Footer";
import Filter_Evidence from "../../components/Student/Approved_Evidence/Filter_Evidence.jsx";
import CustomTable from "../../components/Custom/CustomTable.jsx";
function Approved_Evidence_Page(){
    const evidences=[
        { name_activity: "Chiến dịch tình nguyện hè 2023", name_student: "Nguyễn Văn A", date: "25/08/2023", status: "Chờ duyệt" },
        { name_activity: "Hiến máu nhân đạo đợt 1", name_student: "Trần Thị B", date: "22/08/2023", status: "Đã duyệt" },
        { name_activity: "Chiến dịch tình nguyện hè 2023", name_student: "Nguyễn Văn A", date: "25/08/2023", status: "Chờ duyệt" },
        { name_activity: "Hiến máu nhân đạo đợt 1", name_student: "Trần Thị B", date: "22/08/2023", status: "Đã duyệt" },
        { name_activity: "Chiến dịch tình nguyện hè 2023", name_student: "Nguyễn Văn A", date: "25/08/2023", status: "Chờ duyệt" },
        { name_activity: "Hiến máu nhân đạo đợt 1", name_student: "Trần Thị B", date: "22/08/2023", status: "Đã duyệt" },
        { name_activity: "Chiến dịch tình nguyện hè 2023", name_student: "Nguyễn Văn A", date: "25/08/2023", status: "Chờ duyệt" },
        { naname_activityme: "Hiến máu nhân đạo đợt 1", name_student: "Trần Thị B", date: "22/08/2023", status: "Đã duyệt" }
    ]
    return(
        <>
            <Header/>
            <Menu_student/>
            <div className="approved-evidence-background"></div>
            <Filter_Evidence/>
            <div className="approved-evidence-customtable">
                <CustomTable
                    columns={["Tên hoạt động", "Người nộp", "Ngày nộp", "Trạng thái"]}
                    data={evidences.map((item) => ({
                        tên_hoạt_động: item.name_activity,
                        người_nộp: item.name_student,
                        ngày_nộp: item.date,
                        trạng_thái:item.status,
                    }))}
                    renderActions={() => (
                        <>
                            <button className="px-2 py-1 border rounded">
                                <a href="/evidence-details">Xem</a>
                            </button>
                            <button className="px-2 py-1 bg-green-200 rounded">Duyệt</button>
                        </>
                    )}
                />
            </div>
            <Footer/>
        </>
    );
}
export default Approved_Evidence_Page;