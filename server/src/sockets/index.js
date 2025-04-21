const { Server } = require("socket.io");
const registerRoomHandlers = require("./roomEvents");
const registerCodeHandlers = require("./codeEvents");
const registerChatHandlers = require("./chatEvents");
function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "DELETE"],
    },
  });       
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    registerRoomHandlers(io, socket);
    registerCodeHandlers(io, socket);
    registerChatHandlers(io, socket);
  });
  //     console.log("User connected:", socket.id);
  //     //socket.emit("connected", socket.id);
  //     socket.on("join-room", ({ roomId, username }) => {
  //       socket.join(roomId);
  //       console.log(`${username} joined room ${roomId}`);
  //     });
  //     socket.on("host-end-room", ({ roomId }) => {
  //       io.to(roomId).emit("room-ended");
  //       io.socketsLeave(roomId);
  //       console.log(`Room ${roomId} ended by host`);
  //     });
  //     socket.on("login-room",()=>{
  //       socket.emit("handle-login");
  //     })
  //     socket.on("disconnect", () => {
  //       console.log("User disconnected:", socket.id);
  //     });
  //     // ----------------------------------------------------------
  //     socket.on("send-code", ({  code }) => {
  //       console.log("Code received from client:", code);
  //       // socket.to(roomId).emit("receive-code", code);
  //     });
  //   });
}

module.exports = { setupSocket };
