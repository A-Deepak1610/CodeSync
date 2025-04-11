// server.js
const app = require('./app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require("dotenv").config();
// const db = require("./src/config/db");
// const PORT = process.env.PORT || 8080;
// app.use(bodyParser.json());
// app.use(cors());
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// --------------------------------------------------------------------------------------------

// //Create Room API
// app.post("/create-room", (req, res) => {
//   const { roomId, roomPassword, roomName } = req.body;  
//   const query = `INSERT INTO login (roomid, room_password, roomname) VALUES (?, ?, ?)`;
//   db.query(query, [roomId, roomPassword, roomName], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ err: "Failed to create room" });
//     }
//     // res.status(200).json({ message: "Room created successfully" });
//   });
// });

// ----------------------------------------------------------------------------------------

// // Login API
// app.get("/fetch-login", (req, res) => {
//   const query = `SELECT * FROM login`;
//   db.query(query, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ err: "Failed to fetch login details" });
//     }
//     res.status(200).json({ data: result });
//   });
// });