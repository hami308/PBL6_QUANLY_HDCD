import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./FileUpload.css";
import { uploadBulkUsers } from "../../../services/UserBulkService";

const EXPECTED_HEADERS = ["mã sinh viên", "họ và tên", "khoa", "lớp"];

const FileUploadBox = ({ guideLines, buttonText }) => {
  const fileRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [result, setResult] = useState(null);

  const normalize = (value) => String(value || "").trim();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert sheet to JSON (object-based, dễ map)
        const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (data.length === 0) {
          alert("File Excel không có dữ liệu");
          setStudents([]);
          return;
        }

        // Lấy header thực tế
        const actualHeaders = Object.keys(data[0]).map((h) =>
          h.toLowerCase().trim()
        );

        // Check template (không phụ thuộc thứ tự)
        const isValidTemplate = EXPECTED_HEADERS.every((expected) =>
          actualHeaders.some((h) => h.includes(expected))
        );

        if (!isValidTemplate) {
          alert(
            "File Excel không đúng template.\n" +
              "Cần các cột: Mã sinh viên | Họ và tên | Khoa | Lớp"
          );
          setStudents([]);
          e.target.value = "";
          return;
        }

        // Parse sinh viên (linh hoạt tên cột)
        const parsedStudents = data
          .map((row) => {
            let studentCode = "";
            let fullName = "";
            let faculty = "";
            let className = "";

            Object.keys(row).forEach((key) => {
              const lowerKey = key.toLowerCase();

              if (lowerKey.includes("mã")) studentCode = row[key];
              if (lowerKey.includes("tên")) fullName = row[key];
              if (lowerKey.includes("khoa")) faculty = row[key];
              if (lowerKey.includes("lớp")) className = row[key];
            });

            return {
              studentCode: normalize(studentCode),
              fullName: normalize(fullName),
              faculty: normalize(faculty),
              className: normalize(className),
            };
          })
          .filter((s) => s.studentCode || s.fullName);

        if (parsedStudents.length === 0) {
          alert("Không tìm thấy dữ liệu sinh viên hợp lệ");
          setStudents([]);
          return;
        }

        console.log("✅ Parsed students:", parsedStudents);
        setStudents(parsedStudents);
      } catch (err) {
        alert("Lỗi khi đọc file Excel: " + err.message);
        setStudents([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!students || students.length === 0) {
      alert("Vui lòng chọn file Excel hợp lệ trước");
      return;
    }

    try {
      console.log("➡️ Gửi lên server:", students);

      const res = await uploadBulkUsers(students);

      console.log("⬅️ Kết quả import:", res);

      setResult(res); // ✅ LƯU KẾT QUẢ ĐỂ HIỂN THỊ
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi import sinh viên");
    }
  };

  return (
    <div>
      <div className="file-upload-container">
        <div className="upload-box">
          <span className="material-symbols-outlined upload-icon">
            upload_file
          </span>
          <p>Chọn file Excel</p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx, .xls"
            onClick={(e) => {
              e.target.value = null;
            }}
            onChange={handleFileChange}
          />
        </div>

        <div className="guide-box">
          <p className="guide-title">Hướng dẫn</p>
          <ul>
            {guideLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="action-btn">
        <button
          onClick={handleSubmit}
          disabled={students.length === 0}
          style={{
            backgroundColor: students.length === 0 ? "gray" : "#20217f",
            cursor: students.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          {buttonText}
        </button>
      </div>
      {result && result.data && (
        <div className="import-result">
          <h3>📊 Kết quả import</h3>

          {/* SUMMARY */}
          {result.data.summary && (
            <div className="summary">
              <p>
                📌 Tổng: <b>{result.data.summary.total}</b>
              </p>
              <p>
                ✅ Thành công: <b>{result.data.summary.successful}</b>
              </p>
              <p>
                ❌ Thất bại: <b>{result.data.summary.failed}</b>
              </p>
            </div>
          )}

          {/* SUCCESSFUL */}
          {result.data.successful && result.data.successful.length > 0 && (
            <>
              <h4>✅ Danh sách thành công</h4>
              <table className="result-table success">
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ và tên</th>
                    <th>Username</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.successful.map((s, i) => (
                    <tr key={i}>
                      <td>{s.studentCode}</td>
                      <td>{s.fullName}</td>
                      <td>{s.username}</td>
                      <td>{s.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* FAILED */}
          {result.data.failed && result.data.failed.length > 0 && (
            <>
              <h4>❌ Danh sách thất bại</h4>
              <table className="result-table fail">
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ và tên</th>
                    <th>Lý do</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.failed.map((f, i) => (
                    <tr key={i}>
                      <td>{f.studentCode}</td>
                      <td>{f.fullName}</td>
                      <td>{f.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;
