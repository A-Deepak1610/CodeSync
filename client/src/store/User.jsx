import { create } from "zustand";
import {persist} from 'zustand/middleware';
const User = create(persist((set) => ({
    username0: null,
    setUsername0: (username0) => set({ username0:username0 }),
    createroom:false,
    setCreateroom: (createroom) => set({ createroom:createroom }),
    roomId0: null,
    setRoomId0: (roomId0) => set({ roomId0:roomId0 }),
    roomPassword0: null,
    setRoomPassword0: (roomPassword0) => set({ roomPassword0:roomPassword0 }),
    roomName0: null,
    setRoomName0: (roomName0) => set({ roomName0:roomName0 }),
    hostName: null,
    setHostName: (hostName) => set({ hostName:hostName }),
    isHost0: false,
    setIsHost0: (isHost0) => set({ isHost0:isHost0 }),
}),
{name:"login_storage"},
));
export default User;