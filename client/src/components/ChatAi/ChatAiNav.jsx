import React, { useState } from "react";
import Ai from "../../pages/Ai/Ai";
import Chat from "../../pages/Chat/Chat";
export default function ChatAiNav() {
  const [chatai, setChatAi] = useState("chat");
  return (
    <div className='w-[23%]  bg-[#2d2f34] text-[white] ">'>
      <div className="w-[100%] bg-[#1c2130]  h-[50px] flex items-center justify-between border-l border-gray-500">
        <h1
          className="text-[18px] text-white ml-[10px] cursor-pointer "
          onClick={() => setChatAi("chat")}
        >
          Chat
        </h1>
        <button
          className="bg-[#21ca21] px-1 rounded cursor-pointer mr-[15px]"
          onClick={() => setChatAi("ai")}
        >
          ASK AI
        </button>
      </div>
      {chatai === "chat" ? (
        <div className="w-full h-[84.8vh] bg-[#2d2f34] border-r border-gray-500">
          <Chat />
        </div>
      ) : (
        <div className="w-full h-[84.8vh] bg-[#2d2f34] border-r border-gray-500">
          <Ai />
        </div>
      )}
    </div>
  );
}
