import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./FileUpload.css";
import { uploadBulkUsers } from "../../../services/UserBulkService";

const EXPECTED_HEADERS = ["Mã sinh viên", "Họ và tên", "Khoa", "Lớp"];

const FileUploadBox = ({ guideLines, buttonText }) => {
  const fileRef = useRef(null);
  const [students, setStudents] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!rows || rows.length === 0) {
        alert("File Excel trống");
        setStudents([]);
        return;
      }

      const headers = rows[0]?.map((h) => String(h).trim());

      const isValidTemplate =
        headers.length >= EXPECTED_HEADERS.length &&
        EXPECTED_HEADERS.every(
          (expected, index) => headers[index] === expected
        );

      if (!isValidTemplate) {
        alert(
          `File Excel không đúng template.\n` +
            `Header phải là:\n` +
            EXPECTED_HEADERS.join(" | ")
        );
        setStudents([]);
        e.target.value = "";
        return;
      }

      const parsedStudents = rows
        .slice(1)
        .map((row) => ({
          studentCode: row[0],
          fullName: row[1],
          className: row[2],
          faculty: row[3],
        }))
        .filter((s) => s.studentCode);

      if (parsedStudents.length === 0) {
        alert("Không có dữ liệu sinh viên hợp lệ");
        setStudents([]);
        return;
      }
      console.log(" Dữ liệu đã parse:", parsedStudents);
      setStudents(parsedStudents);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (!students || students.length === 0) {
      alert("Vui lòng chọn file Excel đúng template trước");
      return;
    }

    try {
      console.log("➡️ Gửi lên server:", students);

      const res = await uploadBulkUsers(students);

      let msg = `Tạo thành công: ${res.success?.length || 0} tài khoản\n`;
      msg += `Thất bại: ${res.failed?.length || 0} dòng`;

      alert(msg);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi tạo tài khoản");
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
        <button onClick={handleSubmit} disabled={students.length === 0}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default FileUploadBox;
