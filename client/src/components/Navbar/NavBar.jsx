import React, { use, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import Complier from "../../pages/Compiler/Complier";
import Output_Comp from "../../pages/Output/Output_Comp";
import ChatAiNav from "../ChatAi/ChatAiNav";
import User from "../../store/User";
import { useNavigate, useParams } from "react-router";
import { Button, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { io } from 'socket.io-client';
import Output from "../../store/CodeOutput";
export default function NavBar() {
  const{code_input}=Output();
  const { username0, roomId0, roomPassword0} = User();
  const [hostName, setHostName] = useState("");
  const navigate = useNavigate();
  const { roomid } = useParams();
  const [endRoom, setEndRoom] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? "simple-popover" : undefined;
  const [openDialog, setOpenDiaLog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDiaLog(true);
  };
  const handleCloseDiaglog = () => {
    setOpenDiaLog(false);
  };
  const [participants, setParticipants] = useState([]);
  const [participantsName, setParticipantsName] = useState([]);
  const [ishost, setIsHost] = useState(false);


  const socket = io("http://localhost:7000", {
    transports: ["websocket"],
    autoConnect: false,
  });
  useEffect(() => {
    socket.connect();
    socket.emit("join-room", { roomId: roomId0, username: username0 });
    socket.on("room-ended", () => {
      localStorage.removeItem(`room-${roomid}-auth`, "ture");
      alert("Room is closed by host");
      console.log("Room is closed by host");
      navigate("/login");
    });
    // socket.on("connected",(socketId) => {
    //   handleParticipants();
    // });
    return () => {
      socket.disconnect();
    };
  }, [roomId0, username0, socket, navigate]);

  const handleLogout = () => {
    if(ishost){
      socket.emit("host-end-room", { roomId: roomId0 });
      handelEndRoom();//delets room and participants
      setEndRoom(true);
    }
    else{
    handleDeleteParticipants(username0);
    localStorage.removeItem(`room-${roomid}-auth`, "ture");
    navigate("/login");
    }
  };
  const handleParticipants = async () => {
    try {
      const res = await fetch(
        `http://localhost:7000/api/room/fetchParticipants?roomId=${roomId0}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("HTTP Error");
      const data = await res.json();
      const transformed = data.data.map((item) => ({
        [item.pname]: item.ptype,
      }));
      for(let i=0;i<data.data.length;i++){
        if(data.data[i].ptype==="host"){
          setHostName(data.data[i].pname);
          let hostname=data.data[i].pname;
          if(username0===hostname){
            setIsHost(true);
          }
        }
      } 
      setParticipantsName(transformed);
      setParticipants(data.data);
      // console.log("Participants:", data);
    } catch (error) {
      console.error("Fetch Error in Participants:", error);
    }
  };
  const handleDeleteParticipants = async (pname) => {
    try {
      const res = await fetch(
        `http://localhost:7000/api/room/deteleParticipants?pname=${pname}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Participants deleted Successfully");
    } catch (error) {
      console.error("Fetch Error in Participants:", error);
    }
  };
  const handelEndRoom=async()=>{
    try {
      const res = await fetch(
        `http://localhost:7000/api/room/deleteRoom?roomId=${roomId0}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Room deleted Successfully");
      localStorage.removeItem(`room-${roomid}-auth`, "ture");
      handleDeleteParticipantsAll();
      navigate("/login");
    } catch (error) {
      console.error("Fetch Error in Participants:", error);
    }
  }
  const handleDeleteParticipantsAll=async()=>{
    try {
      const res = await fetch(
        `http://localhost:7000/api/room/deteleParticipantsAll?roomid=${roomId0}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error("HTTP Error");
      // console.log("Participants deleted Successfully");
    } catch (error) {
      console.error("Fetch Error in Participants:", error);
    }
  }
  useEffect(() => {
    handleParticipants();
  }, [roomId0]);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;
  return (
    <>
      <div className="flex items-center bg-[#6c5ce7] w-[100%] h-15 justify-between text-white">
        <Dialog
          open={openDialog}
          onClose={handleCloseDiaglog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#1f2937",
                color: "white",
                borderRadius: "16px",
                p: 2,
                minWidth: "350px",
              },
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ fontWeight: "bold", fontSize: "1.25rem", mb: 1 }}
          >
            Confirm Leave
          </DialogTitle>
          <DialogContent>
            <Typography id="alert-dialog-description">
              Are you sure you want to {ishost?"end":"leave"} this room?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleCloseDiaglog}
              sx={{
                color: "#9ca3af",
                "&:hover": { backgroundColor: "#374151", color: "white" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              autoFocus
              sx={{
                backgroundColor: "#ef4444",
                color: "white",
                "&:hover": { backgroundColor: "#dc2626" },
              }}
            >
              {ishost?"End Room":"Leave Room"}
            </Button>
          </DialogActions>
        </Dialog>
        <div className="flex">
          <h1 className="ml-10  text-[18px] cursor-pointer">CODE SYNCZ</h1>
          <h1 className="ml-[30px] text-[18px]" onClick={handleParticipants}>
            ROOM ID:{roomId0}
          </h1>
        </div>
        <div className="flex items-center">
          <p
            className="mr-[20px] text-[20px] cursor-pointer"
            aria-describedby={id2}
            onClick={handleClick2}
          >
            <PeopleIcon sx={{ fontSize: "23px" }} /> Participants-
            {participants.length}
          </p>
          <Popover
            id={id2}
            open={open2}
            anchorEl={anchorEl2}
            onClose={handleClose2}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#1f2937",
                  color: "white",
                  borderRadius: 2,
                  boxShadow: 4,
                  minWidth: 200,
                  mt: 1,
                  p: 2,
                },
              },
            }}
          >
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2 border-b border-gray-600 pb-1">
                Participants
              </p>
              {participantsName.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No participants</p>
              ) : (
                participantsName.map((item, index) => {
                  const name = Object.keys(item)[0];
                  const role = item[name];
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-white/10 transition text-sm"
                    >
                      <span className="font-medium">{name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          role === "host"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {role}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </Popover>
          <div className="mr-4">
            <Tooltip title="Settings">
              <IconButton
                onClick={handleClick}
                className="hover:bg-white/10 transition"
              >
                <SettingsIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              slotProps={{
                paper:{
                sx: {
                  backgroundColor: "#1f2937",
                  color: "white",
                  borderRadius: "12px",
                  boxShadow: 4,
                  mt: 1,
                  minWidth: "180px",
                },
              }
              }}
            >
              <div className="flex flex-col p-4 space-y-2">
                <Button
                  aria-describedby={id1}
                  onMouseEnter={handleClick1}
                  // onMouseLeave={handleClose1}
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "rgb(108, 92, 231,0.3)" },
                  }}
                >
                  Room Details
                </Button>
                <Button
                  onClick={handleOpenDialog}
                  sx={{
                    color: "#f87171",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.2)" },
                  }}
                >
                  {ishost?"End Room":"Leave Room"}
                </Button>
              </div>
            </Popover>
            <Popover
              id={id1}
              open={open1}
              anchorEl={anchorEl1}
              onClose={handleClose1}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper:{
                onMouseLeave: handleClose1,
                sx: {
                  backgroundColor: "#1f2937",
                  color: "white",
                  borderRadius: "12px",
                  boxShadow: 4,
                  p: 2,
                },
              }
              }}
            >
              <div className="flex flex-col border-none">
                <Typography sx={{ p: 2 }} className="bg-[#1f2937] text-white">
                  Room ID: {roomId0}
                </Typography>
                <Typography sx={{ p: 2 }} className="bg-[#1f2937] text-white">
                  Room Password: {roomPassword0}
                </Typography>
                <Typography sx={{ p: 2 }} className="bg-[#1f2937] text-white">
                  Created By: {hostName}
                </Typography>
              </div>
            </Popover>
          </div>
          <h1 className="mr-[30px] text-[20px]">{username0} </h1>
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
