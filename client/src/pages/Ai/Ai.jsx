import React, { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Output from "../../store/CodeOutput";
import ReactMarkdown from "react-markdown";
export default function Ai() {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState("");
  const { code_input, output } = Output();
  const [prompt, setPrompt] = useState("");
  async function handleAi() {
    setLoading(true);
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              // and dont directly give the code you just encourage them to do it
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
    console.log(data);
    const rawResponse = data.choices[0].message.content;
    const formattedResponse = rawResponse
      .replace(/\*\*(.*?)\*\*/g, "**$1**") // Keep bold formatting
      .replace(/\r\n|\r|\n/g, "\n") // Normalize newlines
      .replace(/\n{2,}/g, "\n\n") // Ensure double newlines for Markdown blocks
      .replace(/(?<=\n)([*\-+] )/g, "\n$1") // Fix for list items
      .replace(/(?<=\n)(\d+\. )/g, "\n$1"); // Fix for ordered list items

    setResponses(formattedResponse);
    // console.log("Formatted Response:\n", formattedResponse);
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt.trim() !== "") {
      e.preventDefault();
      handleAi();
    }
  };
  // useEffect(()=>{
  //   if(responses==""){
  //     setResponses("Please wait for the response")
  //   }
  // },[responses])
  return (
    <>
      <div className="w-full h-[calc(92.8vh-120px)] bg-[#18191c] overflow-y-auto overflow-x-hidden px-3 py-2 scrollbar-hide custom-scrollbar">
        {responses === "" ? (
          <div className="flex h-[calc(90vh-150px)] flex-col items-center justify-center text-center text-gray-500 space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 16v-2m8-6h-2M6 12H4m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414M18 12a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>

            <p className="text-base sm:text-lg font-medium">
               Ask anything  about the code
            </p>
          </div>
        ) : (
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold mb-2 text-white" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-semibold mb-2 text-blue-300"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-semibold mb-2 text-green-300"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-white mb-2 leading-relaxed" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="list-disc ml-6 text-white" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-yellow-300" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-purple-300" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-500 underline hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                const [copied, setCopied] = useState(false);

                const handleCopy = () => {
                  navigator.clipboard.writeText(children).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  });
                };

                return inline ? (
                  <code
                    className="bg-gray-800 text-green-400 px-1 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="relative group">
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 text-sm px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 hidden group-hover:block transition"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <pre className="bg-[#1f1f1f] p-3 rounded-lg text-green-400 overflow-x-auto my-2">
                      <code {...props}>{children}</code>
                    </pre>
                  </div>
                );
              },
              img: ({ node, ...props }) => (
                <img
                  className="rounded-lg max-w-full my-2"
                  alt="markdown image"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <table
                  className="table-auto border-collapse w-full text-white border border-gray-600 my-4"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-gray-500 px-4 py-2 bg-gray-700 text-white"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border border-gray-500 px-4 py-2 text-white"
                  {...props}
                />
              ),
            }}
          >
            {responses}
          </ReactMarkdown>
        )}
      </div>
      <div className="p-3 h-[65px]  border-t border-gray-700 bg-[#1e1f25] flex gap-2">
        <textarea
          value={prompt}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Anything About The Code..."
          className="flex-1 px-4 py-2 h-[40px] rounded-lg bg-[#2d2f34] text-white border border-gray-600 focus:outline-none   resize-none scrollbar-hide"
        ></textarea>

        <Tooltip
          title={prompt.trim() === "" ? "Please enter a question" : "Send"}
        >
          <IconButton
            disabled={loading}
            onClick={prompt.trim() === "" ? null : handleAi}
            sx={{
              color: "#fff",
              backgroundColor: prompt.trim() === "" ? "#00a63e" : "#00a63e",
              padding: "8px",
              height: "40px",
              width: "40px",
              borderRadius: "8px",
              cursor: prompt.trim() === "" ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: prompt.trim() === "" ? "#4ade80" : "#16a34a",
              },
            }}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}
