import React, { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hey team, are we meeting today?", time: "10:15 AM" },
    { id: 2, sender: "You", text: "Yes, let’s meet at 11.", time: "10:16 AM" },
    { id: 3, sender: "Bob", text: "Works for me!", time: "10:17 AM" },
    { id: 4, sender: "You", text: "Great, see you all in the call.", time: "10:18 AM" },
    { id: 5, sender: "Charlie", text: "Don't forget the slides!", time: "10:20 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const handleSend = () => {
    if (newMessage.trim() === "") return;
    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#18191c] ">
      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-5 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === "You";
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                isUser ? "items-end ml-auto" : "items-start"
              }`}
            >
              <span className="text-xs text-gray-400 mb-1">{msg.sender}</span>
              <div
                className={`rounded-2xl px-4 py-2 text-sm shadow-md ${
                  isUser
                    ? "bg-green-600 text-white"
                    : "bg-[#e5e5ea] text-black"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-3 border-t border-gray-700 bg-[#1e1f25] flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-[#2d2f34] text-white border border-gray-600 focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white cursor-pointer transition duration-200 ease-in-out"
        >
          Send
        </button>
      </div>
    </div>
  );
}
