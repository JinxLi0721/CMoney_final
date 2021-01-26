var express = require('express');
var router = express.Router();



const pomodoroControler = require('../controllers/pomodoroController');

router.post('/addpomodoro/:id',pomodoroControler.addPomodoro);
router.get('/deletepomodoro/:id/:id_pomodoro',pomodoroControler.deletePomodoro);

module.exports = router;