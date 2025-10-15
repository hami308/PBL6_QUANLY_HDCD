import React from "react";
import "./FileUpload.css";

const FileUploadBox = ({
  guideLines, // mảng hướng dẫn
  buttonText, // text nút
  onSubmit, // hàm xử lý khi click
}) => {
  return (
    <div>
      <div className="file-upload-container">
        {/* Khung upload file */}
        <div className="upload-box">
          <span className="material-symbols-outlined upload-icon">
            upload_file
          </span>
          <p>Chọn file Excel</p>
          <input
            type="file"
            className="choose-file-btn"
            accept=".xlsx, .xls"
            placeholder="  Chọn file Exel"
          />
          <p className="note">Chỉ hỗ trợ định dạng .xlsx, .xls</p>
        </div>

        {/* Hướng dẫn */}
        <div className="guide-box">
          <p className="guide-title">Hướng dẫn</p>
          <ul>
            {guideLines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Button */}
      <div className="action-btn">
        <button onClick={onSubmit}>{buttonText}</button>
      </div>
    </div>
  );
};

export default FileUploadBox;
