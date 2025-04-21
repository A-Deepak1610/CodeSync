module.exports =function(io,socket){
    socket.on('send-message', ({ roomId, username, message }) => {
        console.log("Received message from client:", message);
      io.to(roomId).emit('receive-message', { username, message });
      console.log("Sent message to room:", roomId);
    });
}
