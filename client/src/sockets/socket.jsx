// socket.js
import { io } from 'socket.io-client';

const socket = io('https://gateway01.us-west-2.prod.aws.tidbcloud.com/api', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
