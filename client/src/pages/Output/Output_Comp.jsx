import React from "react";
import Output from "../../store/CodeOutput";

export default function Output_Comp() {
  const { output, time, input, handleInput } = Output();

  const handleInputChange = (e) => {
    handleInput(e.target.value);
  };

  return (
    <div className="w-[30%]  bg-[#0d1117] flex flex-col">
      {/* Header */}
      <div className="w-full bg-[#1c2130] h-[50px] border-b border-gray-700 flex items-center px-4">
        <h1 className="text-lg text-white font-semibold">Output</h1>
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-b border-[#2c2f3a]">
        <label className="text-white text-sm block mb-1">Input:</label>
        <textarea
          value={input}
          onChange={handleInputChange}
          className="w-full h-[60px] p-2 scrollbar-hide rounded-md bg-[#2d2f3c] text-white border border-[#444] focus:ring-2 focus:ring-[#4c8bf5] outline-none resize-none"
          placeholder="Enter input here... (optional)"
        />
      </div>

      {/* Output Area */}
      <div className="flex-1 px-4 py-3 overflow-auto custom-scrollbar">
        <h2 className="text-white text-sm mb-2">Output:</h2>
        <pre className="whitespace-pre-wrap break-words text-[#e0e0e0] text-sm bg-[#1e1e2e] p-3 rounded-md border border-[#333]">
          {output === null ? "Click on RUN button to see the output" : output}
        </pre>
      </div>

      {/* Execution Time */}
      <div className="px-4 py-2 text-right text-yellow-300 text-xs border-t border-[#2c2f3a]">
        Execution Time: {time}
      </div>
    </div>
  );
}
