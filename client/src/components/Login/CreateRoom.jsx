import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";    
import Snackbar from '@mui/material/Snackbar';     
import User from "../../store/User";
export default function CreateRoom() {
  const {createroom,setRoomId0,setRoomPassword0,setRoomName0,setUsername0}=User();
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();
  const [roomdetails, setRoomDetails] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [hostName, setHostName] = useState("");
  const generateRoomId = async()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/room/login`, {
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
    if(!roomName || !roomId || !roomPassword||!username){
      setInvalid(true);
      return;
    }
    const roomid = roomId.split(":")[1];
    try{
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/room/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({
          roomId:roomid,
          roomPassword: roomPassword,
          roomName: roomName,
        }),
      })
      const data = await res.json();
      handleParticipants();
      // console.log("Created Room:", roomId);
      setRoomId0(roomid);
      localStorage.setItem(`room-${roomId}-auth`, 'true');
      setTimeout(()=>{navigate(`/${roomId}`);},1000);
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Room Created Successfully");
      handleClick();
      generateRoomId();
      setInvalid(false);
    }
    catch (error){
      console.error("Fetch Error:", error);
    }
  };
  const handleParticipants=async()=>{
    try{
      const res=await fetch(`${import.meta.env.VITE_APP_API_URL}/room/createPariticipants`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          roomId:roomId.split(":")[1],
          username:username,
          role:"host",
          hostName:hostName,
        }),
      })
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Participants added Successfully Host");
    }
    catch(error){
      console.error("Participants error :", error);
    }
  }
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
            autoFocus
            placeholder="User Name"
            value={username}
            onChange={(e) => {setUsername(e.target.value);setHostName(e.target.value);setUsername0(e.target.value)}}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => {setRoomName0(e.target.value);setRoomName(e.target.value)}}
            className="w-full p-3 rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Room ID (Auto Generated)"
            value={roomId}
            onChange={(e) => setRoomId0(e.target.value)}
            disabled
            className="w-full p-3  rounded-lg bg-[#1e1f25] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 cursor-not-allowed focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Set Room Password"
            value={roomPassword}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            onChange={(e) => {setRoomPassword(e.target.value);setRoomPassword0(e.target.value)}}
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
