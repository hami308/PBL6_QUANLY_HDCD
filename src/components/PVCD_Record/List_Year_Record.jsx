import "./List_Year_Record.css";
import Year_Record from "./Year_Record.jsx";
import { useEffect, useState } from "react";
import {get_pvcd_by_idstudent} from "../../services/PVCD_Service.js";

function List_Year_Record() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const studentId = "68f905f7585ae2c65d0e5501"; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get_pvcd_by_idstudent(studentId);
                const apiData = response?.data || [];

                const formatted = apiData.map(item => ({
                    record: item.total_point,
                    start_year: new Date(item.start_year).getFullYear(),
                    end_year: new Date(item.end_year).getFullYear(),
                }));

                setData(formatted);
            } catch (err) {
                console.error("Lỗi API:", err);
                setError("Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="list-year-record">
            {data.map((item, index) => (
                <Year_Record
                    key={index}
                    year={index + 1}         
                    start_year={item.start_year}
                    end_year={item.end_year}
                    record={item.record}
                />
            ))}
        </div>
    );
}

export default List_Year_Record;
