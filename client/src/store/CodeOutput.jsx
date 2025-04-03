import { create } from "zustand";
const Output = create((set) => ({
    output:null,
    time:0.000,
    input:"",
    code_input:"",
    handelCodeInput:(data)=>set({code_input:data}),
    handleInput:(data)=>set({input:data}),
    handeleTime:(data)=>set({time:data}),
    handleOutput:(data)=>set({output:data}),
}));
export default Output;