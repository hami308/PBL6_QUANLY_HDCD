import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import { askAnything, analyzeImage } from "../../services/Chatbot";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Xin chào! 👋 Tôi là trợ lý ảo của bạn. Bạn có thể hỏi tôi bất cứ điều gì về hoạt động, PVCD, lớp học… hoặc tải ảnh lên!",
      timestamp: new Date(),
      suggested_questions: [
        "Hoạt động sắp tới là gì?",
        "Điểm PVCD của em bao nhiêu?",
        "Làm sao để đăng ký hoạt động?",
        "Lớp của em là gì?",
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------- SEND MESSAGE -------------------
  const sendMessage = async (text = null) => {
    const messageText = text || input.trim();
    if (!messageText && !selectedFile) return;

    setLoading(true);

    // User message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: selectedFile ? `📸 Ảnh: ${selectedFile.name}` : messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let data;

    try {
      if (selectedFile) {
        data = await analyzeImage(selectedFile);
      } else {
        data = await askAnything(messageText);
      }
    } catch (error) {
      data = { success: false, message: "Lỗi không xác định" };
      console.error("Send Message Error:", error);
    }

    // Reset ảnh
    if (selectedFile) {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    // Bot message
    const botMessage = {
      id: messages.length + 2,
      type: "bot",
      content:
        data?.data?.response ||
        data?.data?.extracted_text ||
        data?.message ||
        "Không thể xử lý yêu cầu.",
      timestamp: new Date(),
      suggested_questions: data?.data?.suggested_questions || [],
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleSuggested = (q) => sendMessage(q);

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Trợ Lý Ảo</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.type}`}>
                <div className="message-content">
                  <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>

                  {msg.suggested_questions?.length > 0 && (
                    <div className="suggested-questions">
                      <p className="suggestion-label">💡 Câu hỏi gợi ý:</p>
                      {msg.suggested_questions.map((q, i) => (
                        <button
                          key={i}
                          className="suggestion-btn"
                          onClick={() => handleSuggested(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {loading && (
              <div className="message bot">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            {selectedFile && (
              <div className="file-preview">
                📎 {selectedFile.name}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="input-controls">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept="image/*"
                style={{ display: "none" }}
              />
              <button
                className="file-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📸
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập câu hỏi..."
              />

              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() && !selectedFile}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
