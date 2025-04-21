import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Output from "../../store/CodeOutput";
import socket from "../../sockets/socket";
import User from "../../store/User";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
export default function Complier() {
  const [code, setCode] = useState(`#include <stdio.h>
        int main() {
            printf("Hello, World!");
            return 0;
        }`);
  const { handleOutput, handeleTime, input, handleInput, handelCodeInput } =
    Output();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("c");
  const { roomId0, username0, isHost0 } = User();
  const [editAcess, setEditAcess] = useState(isHost0);
  // console.log("edit access", editAcess);
  const fromSocketRef = useRef(false);

  function handleLanguage(e) {
    setLanguage(e.target.value);
    handleOutput("");
    const codeSamples = {
      c: `#include <stdio.h>
      int main(){
      printf("Hello, World!");
      return 0;
      }`,
      javascript: `console.log("Hello, World!");`,
      cpp: `#include <iostream>
            int main() {
              std::cout << "Hello, World!" << std::endl;
              return 0;
            }`,
      java: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello, World!");
            }
        }`,
      python: `print("Hello, World!")`,
    };
    setCode(codeSamples[e.target.value] || "// Start coding here...");
  }
  const handleRun = async () => {
    setLoading(true);
    let languageId = 0;
    if (language === "c") {
      languageId = 110;
    } else if (language === "javascript") {
      languageId = 102;
    } else if (language === "cpp") {
      languageId = 54;
    } else if (language === "java") {
      languageId = 62;
    } else if (language === "python") {
      languageId = 71;
    }
    const apiUrl = "https://judge0-ce.p.rapidapi.com/submissions?wait=true";
    const apiKey = "80c4ae2854mshb541b4b08f012b4p11ed44jsn2eb37449970b";
    const requestData = {
      source_code: code,
      language_id: languageId,
      stdin: input, // Provide input if needed
    };

    try {
      // Step 1: Submit the code
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      if (data.status.description === "Compilation Error") {
        handleOutput(data.compile_output);
        handeleTime("0.000");
      } else if (data.status.description === "Runtime Error (NZEC)") {
        handleOutput(data.stderr);
        handeleTime("0.000");
      } else {
        handleOutput(data.stdout);
        const time = data.time;
        handeleTime(data.time);
      }
      setLoading(false);
      handleInput("");
    } catch (error) {
      console.error("Error running code:", error);
    }
  };
  const handleCodeChange = (newCode) => {
    if (fromSocketRef.current) {
      fromSocketRef.current = false;
      return;
    }
    handelCodeInput(newCode);
    setCode(newCode);
    socket.emit("send-code", { roomId: roomId0, code: newCode });
    socket.emit("user-typing", { roomId: roomId0, username: username0 });
  };
  const [open, setOpen] = React.useState(false); 
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("join-room", { roomId: roomId0, username: username0 });
    socket.on("receive-code", (receivedCode) => {
      fromSocketRef.current = true;
      setCode(receivedCode);
    });
    return () => {
      socket.off("receive-code");
    };
  }, [roomId0, username0, socket]);
  const [activeEditorUser, setActiveEditorUser] = useState(null);
  useEffect(() => {
    socket.on("user-typing-feedback", ({ username }) => {
      setActiveEditorUser(username);
      setTimeout(() => setActiveEditorUser(null), 1000);
    });
    return () => socket.off("user-typing-feedback");
  }, [code]);
  function handleRequestAccess() {
    socket.emit("request-edit-access", {
      roomId: roomId0,
      username: username0,
    });
    console.log("Request sent to the host for edit access.");
  }
  const [editAccessUserName, setEditAccessUserName] = useState(null);
  useEffect(() => {
    socket.on("send-edit-access", ({ username }) => {
      if (isHost0) {
        setEditAccessUserName(username);
        console.log("Request for edit access received from:", username);
        handleClickOpen();
        setTimeout(()=>handleClose(),2000);
      }
    });
    return () => {
      socket.off("send-edit-access");
    };
  }, [code, isHost0, socket,roomId0]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleGrantAccess = () => {
    socket.emit("edit-access-granted", {
      roomId: roomId0,
      username: editAccessUserName,
    });
  }
  useEffect(() => {
    socket.on("edit-access-granted-user", ({ username }) => {
      console.log(" user name", username);
      console.log("edit access user name", username0);
      if (username === username0) {
        setEditAcess(true);
        console.log("access granted to:", username);
        console.log("edit access changed to false");    
      }
    });
    return () => {
      socket.off("edit-access-granted-user");
    };
  }, [socket, editAccessUserName,code, editAcess]);



  return (
    <div className="w-[47%] bg-[#2d2f34]">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-access-dialog-title"
        aria-describedby="edit-access-dialog-description"
      >
        <DialogTitle id="edit-access-dialog-title">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="edit">
              ✍️
            </span>
            <span className="text-lg font-semibold">Edit Access Request</span>
          </div>
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="edit-access-dialog-description"
            className="text-gray-700 text-base"
          >
            <span className="font-medium text-blue-600">{editAccessUserName}</span> is
            requesting access to edit the code. Do you want to grant permission?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Deny
          </Button>
          <Button 
            onClick={handleGrantAccess}
            autoFocus
            color="primary"
            variant="contained"
          >
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>
      <div className="w-[100%] bg-[#1c2130] border-r border-gray-500 h-[50px] flex items-center justify-between">
        <div className="h-[50px] flex items-center w-[100px]  ">
          <h1 className="text-[18px] text-white ml-[20px]">main.c</h1>
        </div>
        <div className="flex items-center mr-[10px]">
          <p className="mr-[10px]">Language:</p>
          <select
            className="mr-[10px]  bg-[black] cursor-pointer"
            onChange={handleLanguage}
          >
            <option value="c">C</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
          <Button variant="contained" className="h-[30px]" onClick={handleRun}>
            {loading ? "Running..." : "Run"}
          </Button>
        </div>
      </div>
      <div className="relative w-full h-[84.8vh] bg-gray-900  overflow-hidden border border-gray-700 shadow-md">
        <Editor
          options={{
            readOnly: !editAcess,
            quickSuggestions: { other: true, comments: true, strings: true },
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: true,
            minimap: { enabled: false },
          }}
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(newCode) => handleCodeChange(newCode)}
        />

        {/* Floating Request Access or Info */}
        <div className="absolute top-3 right-4 z-10">
          {!editAcess ? (
            <button
              className="bg-yellow-600 cursor-pointer hover:bg-yellow-500 text-white font-semibold px-2 py-1 rounded-full text-sm shadow-lg transition duration-200"
              onClick={handleRequestAccess}
            >
              🔒 Request Edit Access
            </button>
          ) : (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow-lg">
              ✅ You have edit access
            </span>
          )}
        </div>
        {/* Typing Indicator */}
        {activeEditorUser && (
          <div className="absolute top-14  right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow animate-pulse">
            ✍️ {activeEditorUser} is editing...
          </div>
        )}
      </div>
    </div>
  );
}
