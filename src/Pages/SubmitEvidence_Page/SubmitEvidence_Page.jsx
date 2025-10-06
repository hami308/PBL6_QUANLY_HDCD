import "./SubmitEvidence_Page.css";
import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import SubmitEvidence from "../../components/Student/SubmitEvidence/SubmitEvidence";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable.jsx";
function SubmitEvidence_Page() {
   const evidenceData = [
    {
        id: 1,
        name: "Tham gia hội thảo khoa học quốc gia",
        link: "https://example.com/minhchung1",
        score: "5",
        date: "01/10/2025",
        status: "Đã duyệt",
    },
    {
        id: 2,
        name: "Tình nguyện Mùa hè xanh 2025",
        link: "https://example.com/minhchung2",
        score: "10",
        date: "15/08/2025",
        status: "Đang Chờ duyệt",
    },
    {
        id: 3,
        name: "Tham gia cuộc thi Lập trình sinh viên 2025",
        link: "https://example.com/minhchung3",
        score: "8",
        date: "20/09/2025",
        status: "Đã duyệt",
    },
    ];
    return(
        <>
            <Header />
            <Menu_student />
            <SubmitEvidence />
            <h3 className="cross-bar">Danh sách các minh chứng đã nộp</h3>
           <div className="filter-sort-container">
            <select name="status" className="status-filter">
                <option value="" disabled>-- Chọn tình trạng --</option>
                <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                <option value="Đã duyệt">Đã duyệt</option>
            </select>

            <button className="sort-button">
                <span>Sắp xếp theo thời gian</span>
                <span className="material-symbols-outlined">sort</span>
            </button>
            </div>
            <CustomTable
                columns={["Tên hoạt động","Ngày nộp","Tình trạng"]}
                data={evidenceData.map((item) => ({
                    tên_hoạt_động: item.name,
                    ngày_nộp:item.date,
                    tình_trạng:item.status,
                }))}
                renderActions={() => (
                    <>
                        <button className="px-2 py-1 border rounded" ><a href="/evidence-details">Chi tiết</a></button>    
                    </>
                )}
            />
            <Footer />
            
        </>
    );
}
export default SubmitEvidence_Page;