import "./List_Year_Record.css";
import Year_Record from "./Year_Record.jsx";

function List_Year_Record({ data }) {
    if (!data || data.length === 0)
        return <p className="no-data">Không có dữ liệu năm</p>;

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
