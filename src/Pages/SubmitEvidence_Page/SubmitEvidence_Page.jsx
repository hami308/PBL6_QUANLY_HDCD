import "./SubmitEvidence_Page.css";
import Header from "../../components/Header/Header";
import Menu_student from "../../components/Menu/Menu_student";
import SubmitEvidence from "../../components/Student/SubmitEvidence/SubmitEvidence";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable.jsx";
import React, { useState } from "react";
function SubmitEvidence_Page() {
    const [sortOrder, setSortOrder] = useState("desc"); // "desc" = mới nhất, "asc" = cũ nhất

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
    // const sortedData = [...evidenceData].sort((a, b) => {
    //     const dateA = a.date.split("/").reverse().join("-");
    //     const dateB = b.date.split("/").reverse().join("-");
    //     if (sortOrder === "desc") {
    //         return dateB.localeCompare(dateA);
    //     } else {
    //         return dateA.localeCompare(dateB);
    //     }
    // });
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

             <select
                    className="sort-select"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    style={{ marginLeft: 12 }}
                >
                     <option value="" disabled>--Sắp xếp --</option>
                    <option value="desc">Mới nhất</option>
                    <option value="asc">Cũ nhất</option>
                </select>
            </div>
            <div className="submit-evidence-customtable">
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
            </div>
            <Footer />
            
        </>
    );
}
export default SubmitEvidence_Page;