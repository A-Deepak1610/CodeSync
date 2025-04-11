import React, { use, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import Complier from "../../pages/Compiler/Complier";
import Output_Comp from "../../pages/Output/Output_Comp";
import ChatAiNav from "../ChatAi/ChatAiNav";
import User from "../../store/User";
export default function NavBar(){
  // const roomId = "657";
  const {roomId,setRoomId}=User();
   async function handelCheck(){
    console.log(roomId)
    try {
      const res = await fetch("http://localhost:7000/fetch-login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("Fetched Details Login:",data.data);
      const matchedRoom = data.data.find(
        (room) => room.roomid === roomId 
      );
      console.log("Matched Room:", matchedRoom);
      if (!matchedRoom) {
        navigate(`/`);
      }  
      if (!res.ok) throw new Error("HTTP Error");
    } catch (error){
      console.error("Fetch Error:", error);
    }
  }
  useEffect(() => {
    handelCheck();
  }, []);
  return (
    <>
      <div className="flex items-center bg-[#6c5ce7] w-[100%] h-15 justify-between text-white">
        <div className="flex">
          <h1 className="ml-10  text-[18px] cursor-pointer">CODE SYNCZ</h1>
          <h1 className="ml-[30px] text-[18px]">Room ID:10</h1>
        </div>
        <div className="flex items-center">
          <p className="mr-[20px] text-[20px] cursor-pointer">
            <PeopleIcon sx={{ fontSize: "23px" }} /> Participants-10
          </p>
          <p className=" mr-[15px]">
            <Tooltip title="Settings">
              <IconButton>
                <SettingsIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </p>
          <h1 className="mr-[30px] text-[20px]">Deepak </h1>
        </div>
      </div>
      <div className="flex text-white h-[90vh] mainarea">
        <Complier />
        <Output_Comp />
        <ChatAiNav />
      </div>
    </>
  );
}
