import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import User from "../../store/User";
export default function CreateRoom() {
  const {username,setUsername,createroom,roomId,setRoomId,roomPassword,setRoomPassword}=User();
  const [roomName, setRoomName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();
  const [roomdetails, setRoomDetails] = useState([]);
  const generateRoomId = async()=>{
    try {
      const res = await fetch("http://localhost:7000/fetch-login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setRoomDetails(data.data);
      if (!res.ok) throw new Error("HTTP Error");
    } catch (error){
      console.error("Fetch Error:", error);
    }
    const randomId = Math.floor(Math.random() * (9999-1000+1))+1000;
    for(let i=0;i<roomdetails.length;i++){
      if(roomdetails[i].roomid===randomId){
        generateRoomId();
        break;
      }
    }
    setRoomId('Room ID:'+randomId);
  }
  useEffect(() => {generateRoomId()},[createroom]);
  const handleCreate = async() => {
    if(!roomName || !roomId || !roomPassword){
      setInvalid(true);
      return;
    }
    const roomid = roomId.split(":")[1];
    try{
      const res = await fetch("http://localhost:7000/api/room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId:roomid,
          roomPassword: roomPassword,
          roomName: roomName,
        }),
      })
      const data = await res.json();
      console.log("Created Room:", data);
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Room Created Successfully");
      handleClick();
      setRoomId("");
      setRoomName("");
      setRoomPassword("");
      // generateRoomId();
      // navigate(`/${roomid}`);
      setInvalid(false);
    }
    catch (error){
      console.error("Fetch Error:", error);
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <div className="flex items-center justify-center h-screen bg-[#1e1f25] text-white">
      <div className="bg-[#2d2f34] p-8 rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Create a Room</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Room ID (Auto Generated)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            disabled
            className="w-full p-3  rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 cursor-not-allowed focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Set Room Password"
            value={roomPassword}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            onChange={(e) => setRoomPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <p className="text-center text-red-400">{invalid?`Invalid Credentials`:""}</p>
          <button
            onClick={handleCreate}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white transition-all duration-300 cursor-pointer"
          >
            Create Room
          </button>
        </div>
      </div>
      <div className="">
        <Snackbar
          open={open}
          autoHideDuration={20000}
          onClose={handleClose}
          message="Room Created Sucessfully!"
        />
      </div>
    </div>
  );
}
