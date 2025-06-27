import React, { useState, useRef, useEffect } from "react";
import User from "../../store/User";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IconButton from "@mui/material/IconButton";
import socket from "../../sockets/socket";
export default function Chat() {
  const { roomId0, username0 } = User();
  const [nodata, setNodata] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("join-room", { roomId: roomId0, username: username0 });
    socket.on("receive-message", (data) => {
      setNodata(false);
      // console.log("Received message from server:", data);
      const newMsg = {
        id: Date.now(),
        sender: data.username,
        text: data.message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      // console.log("Modified msg:", newMsg);
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    });
    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // setNodata(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        sender: username0,
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMessage("");
    handelUpdateMessages();
    socket.emit("send-message",{
      roomId: roomId0,
      username: username0,
      message: newMessage,
    });
  };
  const handelUpdateMessages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/room/createMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomId0,
          sender: username0,
          message: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Message Created Successfully");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [roomId0, username0]);
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/room/fetchMessages?roomId=${roomId0}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("HTTP Error");
      const data = await res.json();
      if (data.data.length === 0) {
        setNodata(true);
        return;
      }
      setMessages(
        data.data.map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.text,
          time: msg.time,
        }))
      );
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // console.log("Messages updated:", messages);
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#18191c] ">
      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
        {nodata ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fadeIn">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8h5a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h5z"
              />
            </svg>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm text-gray-400">
              Start the conversation now 🚀
            </p>
          </div>
        ) : null}
        {messages.map((msg) => {
          const isUser = msg.sender === username0;
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
                  isUser ? "bg-green-600 text-white" : "bg-[#e5e5ea] text-black"
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
      <div className="p-3 sm:px-1.5 border-t border-gray-700 bg-[#1e1f25] flex gap-2 sm:gap-1">
        <input
          type="text"
          className="flex-1 sm:px-2 sm:w-[120px]  lg:px-4 py-2 rounded-lg bg-[#2d2f34] text-white border border-gray-600 focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="sm:px-0 sm:text-[15px]  sm:w-[120px] lg:w-[60px] lg:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white cursor-pointer transition duration-200 ease-in-out"
        >
          Send
        </button>
      </div>
    </div>
  );
}
