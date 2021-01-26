var express = require('express');
var router = express.Router();

const msgController = require('../controllers/msgController');

router.post('/addmsg/:id/:id_room',msgController.addMsg);
router.get('/deletemsg/:id/:id_message',msgController.deleteMsg);
router.get('/showmsg/:id/:id_room',msgController.showMsg);

module.exports = router;