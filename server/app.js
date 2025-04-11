// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const roomRoutes = require('./src/routes/roomRoutes');
const app = express();
app.use(bodyParser.json());
app.use(cors());
// Routes
app.use('/api/room', roomRoutes); // Prefix all routes with /api/room
module.exports = app;
