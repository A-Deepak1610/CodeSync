module.exports = function(io, socket) {
    socket.on('send-code', ({ roomId, code }) => {
      socket.to(roomId).emit('receive-code', code);
    });
    socket.on("user-typing", ({ roomId, username }) => {
      // console.log("User typing event received:", { roomId, username });
      io.to(roomId).emit("user-typing-feedback", { username });
    });
    
  };
  