import React, { useState, useEffect, useRef } from "react";
import { askAnything, getChatHistory } from "../../services/Chatbot";
import "./Chatbot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load history
  useEffect(() => {
    if (isOpen && !historyLoaded) {
      loadChatHistory();
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    try {
      const response = await getChatHistory(50, 1);
      if (response.success && response.data) {
        const historyMessages = [];
        response.data.data.forEach((msg) => {
          if (msg.query) historyMessages.push({ id: msg._id, type: "user", content: msg.query });
          if (msg.answer) historyMessages.push({ id: msg._id + "_bot", type: "bot", content: msg.answer });
        });
        setMessages([
          { id: "welcome", type: "bot", content: "Xin chào! 👋 Tôi là trợ lý ảo của bạn." },
          ...historyMessages,
        ]);
        setHistoryLoaded(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử chat:", error);
    }
  };

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText) return;

    setLoading(true);
    setInput("");

    const userMessage = { id: Date.now(), type: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);

    let response;
    try {
      response = await askAnything(messageText);
    } catch (error) {
      console.error("Error sending message:", error);
      response = { success: false, message: "Lỗi kết nối server" };
    }

    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: response?.data?.answer || response?.message || "Không thể xử lý yêu cầu",
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <button onClick={() => setIsOpen((prev) => !prev)} className="chatbot-toggle">
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Trợ Lý Ảo</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.type}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {loading && <div className="message bot">Đang trả lời...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
