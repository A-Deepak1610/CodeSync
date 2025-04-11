// src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create', roomController.createRoom);
router.get('/fetch-login', roomController.fetchLogin);

module.exports = router;
