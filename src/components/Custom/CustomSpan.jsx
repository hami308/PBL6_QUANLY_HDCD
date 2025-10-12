import "./CustomSpan.css";
 function CustomSpan({ value, ismodify = true, className}) {
    return (
      <span
        className={className}
        contentEditable={!ismodify} 
        suppressContentEditableWarning={true}
        style={{
            border: !ismodify ? "1px  #ccc" : "none", // viền để phân biệt
        }}
      >
        {value}
      </span>
    );
  }
export default CustomSpan;