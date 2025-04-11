// src/controllers/roomController.js
const db = require('../config/db');

exports.createRoom = (req, res) => {
  const { roomId, roomPassword, roomName } = req.body;
  const query = `INSERT INTO login (roomid, room_password, roomname) VALUES (?, ?, ?)`;
  db.query(query, [roomId, roomPassword, roomName], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err: 'Failed to create room' });
    }
    res.status(200).json({ message: 'Room created successfully' });
  });
};
exports.fetchLogin = (req, res) => {
  const query = `SELECT * FROM login`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err: 'Failed to fetch login details' });
    }
    res.status(200).json({ data: result });
  });
};
