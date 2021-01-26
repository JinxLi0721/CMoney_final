var express = require('express');
var router = express.Router();

const roomController = require('../controllers/roomController');


router.post('/addstudyroom/:id',roomController.addRoom);
router.get('/allroom/',roomController.roomlist);
router.get('/closeroom',roomController.closeRoom);
router.get('/entryroom/:id/:id_room',roomController.entryRoom);
router.get('/leaveroom/:id/:id_room',roomController.leaveRoom);
router.get('/showQA/:id_room',roomController.showQA);
router.get('/roominfo/:id_room',roomController.roomInfo);
router.get('/rankcontain',roomController.rankContain);
router.post('/roomsetting/:id/:id_room',roomController.roomSetting);
router.get('/changebuilder/:id_room',roomController.changeBuilder);
router.get('/roomcotain/:id_room',roomController.roomContain);
router.get('/nextroundtime/:id_room',roomController.nextRoundTime);


module.exports = router;