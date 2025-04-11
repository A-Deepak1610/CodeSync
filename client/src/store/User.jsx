import { create } from "zustand";
import {persist} from 'zustand/middleware';
const User = create((set) => ({
    username: null,
    setUsername: (username) => set({ username }),
    createroom:false,
    setCreateroom: (createroom) => set({ createroom }),
    roomId: "",
    setRoomId: (roomId) => set({ roomId }),
    roomPassword: null,
    setRoomPassword: (roomPassword) => set({ roomPassword }),   
}),
// {name:"login_storage"},
);
export default User;