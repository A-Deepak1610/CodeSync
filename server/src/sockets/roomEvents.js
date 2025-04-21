module.exports = function (io, socket) {
  let username1 = null;
  let roomId1 = null;
  socket.on("join-room", ({ roomId, username }) => {
    io.to(roomId).emit("handle-participants");
    username1 = username;
    roomId1 = roomId;
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", username);
    console.log(`${username} joined room: ${roomId}`);
  });
  socket.on("host-end-room", ({ roomId }) => {
    console.log("Host ended room:", roomId);
    io.to(roomId).emit("room-ended");
    io.in(roomId).socketsLeave(roomId);
  });

  socket.on("request-edit-access", ({ roomId, username }) => {
    console.log(`${username} requested edit access for room: ${roomId}`);
    io.to(roomId).emit("send-edit-access", { username });
    console.log("Sent edit access request to room:", roomId);
  });

  socket.on("edit-access-granted", ({ roomId, username }) => {
    console.log(`Edit access granted to ${username} for room: ${roomId}`);
    io.to(roomId).emit("edit-access-granted-user", { username });
    console.log("Sent access granted notification to room:", roomId);
  });

  socket.on("edit-access-username", ({ roomId, username }) => {
    console.log(`Edit access granted to ${username} for room: ${roomId}`);
    io.to(roomId).emit("edit-access-granted-user-name", { username });
    console.log("Sent access granted notification to room:", roomId);
  });
  socket.on("disconnect", () => {
    // io.to(roomId1).emit("handle-logout",username1);
    console.log("User disconnected:", socket.id, "Username:", username1);
  });
};
