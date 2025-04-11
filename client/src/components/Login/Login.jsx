import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../../store/User";
export default function Login() {
  // const [username, setUsername] = useState("");
  // const [roomdetails, setRoomDetails] = useState([]);
  // const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();
  const {username,setUsername,setCreateroom,roomId,setRoomId}=User();
  const handleJoin = async () => {
    if (!username || !roomId || !roomPassword) {
      setInvalid(true);
    }
    try {
      const res = await fetch("http://localhost:7000/fetch-login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Fetched Details Login:", data.data);
      const matchedRoom = data.data.find(
        (room) => room.roomid === roomId && room.room_password === roomPassword
      );
      if (matchedRoom) {
        navigate(`/${matchedRoom.roomid}`);
        setInvalid(false);
      } else {
        setInvalid(true);
      }  
      if (!res.ok) throw new Error("HTTP Error");
    } catch (error){
      console.error("Fetch Error:", error);
    }
  };
  const handleCreateRoom = () => {
    setCreateroom(true);
    navigate("/create-room");
  };
  return (
    <div className="flex items-center justify-center h-screen bg-[#1e1f25] text-white">
      <div className="bg-[#2d2f34] p-8 rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">CodeSync</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Room Password"
            value={roomPassword}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            onChange={(e) => setRoomPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-center text-red-400">{invalid?`Invalid Credentials`:""}</p>
          <button
            onClick={handleJoin}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white transition-all duration-300"
          >
            Join Room
          </button>

          <p
            onClick={handleCreateRoom}
            className="text-center text-blue-400 hover:text-blue-300 cursor-pointer mt-2"
          >
            Or Create a New Room
          </p>
        </div>
      </div>
    </div>
  );
}
