import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

const initialMessages = [];

export default function App() {
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    const outgoingMessage = {
      id: Date.now(),
      type: "outgoing",
      text: trimmed,
    };

    setMessages((prev) => [...prev, outgoingMessage]);

    if (socket) {
      socket.emit("ai-message", trimmed);
    }

    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");

    setSocket(socketInstance);

    socketInstance.on("ai-message-res", (response) => {
      const botMessage = {
        id: Date.now(),
        type: "incoming",
        text: response.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="chat-app">
      <div className="chat-shell">
        <header className="chat-header">Chat</header>

        <div className="chat-body" role="log" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-bubble">{message.text}</div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            aria-label="Type your message"
          />

          <button type="button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
