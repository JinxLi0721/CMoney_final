var express = require('express');
var router = express.Router();

const letterController = require('../controllers/letterController');

router.post('/send/:id',letterController.sendLetter);
router.get('/delete/:id/:id_letter',letterController.deleteLetter);
router.get('/inbox/:id',letterController.inbox);
router.get('/read/:id/:id_letter',letterController.read);

module.exports = router;