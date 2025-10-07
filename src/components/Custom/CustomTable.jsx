// CustomTable.jsx
import React from "react";
import "./CustomTable.css"; 
function CustomTable({ columns, data, renderActions }) {
    return (
        <div className="custom-table-wrapper">
      <table className="custom-table">
        <thead className="custom-table__head">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="custom-table__header">
                {col}
              </th>
            ))}
            {renderActions && <th className="custom-table__header">Thao tác</th>}
          </tr>
        </thead>
        <tbody className="custom-table__body">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="custom-table__row">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="custom-table__cell">
                  {row[col.toLowerCase().replace(/\s/g, "_")]}
                </td>
              ))}
              {renderActions && (
                <td className="custom-table__cell custom-table__actions">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}
export default CustomTable;
