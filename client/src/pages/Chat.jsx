import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Output from "../store/CodeOutput";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState("");
  const { code_input, handelCodeInput } = Output();
  const [prompt, setPrompt] = useState("");
  async function handleAi() {
    setLoading(true);
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`, // Get free key at groq.com
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: `you are a cooding assistant so for the code given and the prompt given behave based on this and tell suggesstions and any error in the code
          prompt: ${prompt}
          code:${code_input}`,
            },
          ],
        }),
      }
    );
    const data = await response.json();
    setLoading(false);
    setPrompt("");
    setResponses(data.choices[0].message.content);
  }
  const handleKeyDown = (e) => {
    // if (prompt.trim() == "") {
    //   e.preventDefault();
    //   return;
    // }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAi();
    }
  };
  return (
    <div className='w-[23%] h-[91.8vh] bg-[#2d2f34] text-[white] ">'>
      <div className="w-[100%] bg-[#1c2130]  h-[50px] flex items-center justify-between">
        <h1 className="text-[18px] text-white ml-[10px]">Chat</h1>
        <button
          className="bg-[#21ca21] px-1 rounded cursor-pointer mr-[15px]"
          onClick={handleAi}
        >
          {loading ? "..." : "ASK AI"}
        </button>
      </div>
      <div className="w-full h-[calc(90vh-120px)] overflow-y-auto overflow-x-hidden p-3">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-xl font-bold" {...props} />
            ),
            p: ({ node, ...props }) => <p className="text-white" {...props} />,
            code: ({ node, inline, ...props }) => (
              <code
                className="bg-gray-800 text-green-400 p-1 rounded"
                {...props}
              />
            ),
          }}
        >
          {responses}
        </ReactMarkdown>
      </div>
      <div className="px-2 py-0 flex items-center w-full">
        <textarea
          value={prompt}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Anything About The Code..."
          className="w-[98%] h-10 p-2 resize-none mt-[27px] bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 scrollbar-hide"
        ></textarea>

        <Tooltip
          title={prompt.trim() == "" ? "Please enter a question" : "Send"}
        >
          <IconButton
            onClick={prompt.trim() == "" ? null : handleAi}
            sx={{
              color: "white",
              backgroundColor: prompt.trim() == "" ? "#3B82F6" : "#3B82F6",
              marginTop: "25px",
              marginLeft: "10px",
              cursor: prompt.trim() == "" ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: prompt.trim() == "" ? "#6B7280" : "#2563EB",
              },
            }}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
