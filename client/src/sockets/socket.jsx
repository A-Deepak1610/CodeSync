// socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:7000', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
