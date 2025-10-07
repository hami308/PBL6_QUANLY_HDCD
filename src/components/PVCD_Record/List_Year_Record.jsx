import "./List_Year_Record.css";
import Year_Record from "./Year_Record.jsx";
function List_Year_Record() {
    const data=[
        {year:1,record:10},
        {year:2,record:15},
        {year:3,record:20},
        {year:4,record:0},
        {year:5,record:0},
    ];
    return (
        <div className="list-year-record">
            {data.map((item)=>
                <Year_Record key={item.year} year={item.year} record={item.record} />
            )}
        </div>
    );
}
export default List_Year_Record;