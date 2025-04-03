import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import Output from "../store/CodeOutput";
export default function Complier() {
  const [code, setCode] = useState(`#include <stdio.h>
        int main() {
            printf("Hello, World!");
            return 0;
        }`);
  const {output, handleOutput,handeleTime,time,input,handleInput,code_input,handelCodeInput} = Output();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("c");
  useEffect(() => {
    handelCodeInput(code);
  }, [code]);
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
      if(data.status.description === "Compilation Error"){
        handleOutput(data.compile_output);
        handeleTime("0.000");
      }
      else if(data.status.description === "Runtime Error (NZEC)"){
        handleOutput(data.stderr);
        handeleTime("0.000");
      }
      else{
        handleOutput(data.stdout);
        const time = data.time;
        handeleTime(data.time);
      }
      setLoading(false);
      handleInput("");
      // if (data.token) {
      //   // Step 2: Fetch the output
      //   const resultUrl = `https://judge0-ce.p.rapidapi.com/submissions/${data.token}`;
      //   const resultResponse = await fetch(resultUrl, {
      //     method: "GET",
      //     headers: {
      //       "x-rapidapi-key": apiKey,
      //       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      //     },
      //   });
      //   if (!resultResponse.ok) {
      //     throw new Error(`Result fetch failed: ${resultResponse.status}`);
      //   }
      //   const resultData = await resultResponse.json();
      //   console.log("Execution Output:", resultData.stdout);
      // }
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  return (
    <div className="w-[47%] bg-[#2d2f34]">
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
      <div className="w-full h-[84.8vh]  bg-gray-900 border-r border-gray-700 ">
        <Editor
          options={{
            quickSuggestions: { other: true, comments: true, strings: true },
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: true,
            minimap: { enabled: false },
          }}
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(newCode) => setCode(newCode)}
        />
      </div>
    </div>
  );
}
