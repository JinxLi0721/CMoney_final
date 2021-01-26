'use strict';
var express = require('express');
var router = express.Router();


const mainController = require('../controllers/mainController');

router.get('/main',mainController.main);
router.get('/register',mainController.register);
router.get('/studyRoom',mainController.studyRoom);
router.get('/mesBoard',mainController.mesBoard);


module.exports = router;
