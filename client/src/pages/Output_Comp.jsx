import React from "react";
import Output from "../store/CodeOutput";
export default function Output_Comp() {
  const { output, time,input,handleInput } = Output();
  const handleInputChange = (e) =>{
    handleInput(e.target.value);
  };
  return (
    <div className="w-[30%] h-[91.8vh] bg-[#000000]">
      <div className="w-[100%] bg-[#1c2130]  h-[50px] border-r border-gray-500 flex items-center">
        <h1 className="text-[18px] text-white ml-[10px]">Output</h1>
      </div>
      <div className="px-[5px]">
          <label className="text-white text-[14px]">Input:</label>
          <textarea
            value={input}
            onChange={handleInputChange}
            className="w-full h-[50px] mt-2 p-2 rounded bg-[#2d2f3c] text-white outline-none resize-none border-[#444]"
            placeholder="Enter input here... (optional)"
          />
        </div>
      <div className="px-[5px] h-[69.5vh]  rounded custom-scrollbar">
        <pre className="whitespace-pre-wrap break-words">{output}</pre>
      </div>
      <div className="float-end mr-1.5 text-[#ffff00cf] text-[14px]">
        Execution Time:{time}
      </div>
    </div>
  );
}
