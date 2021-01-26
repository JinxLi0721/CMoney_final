var express = require('express');
var router = express.Router();

const replyController = require('../controllers/replyController');

router.post('/addreply/:id/:id_question',replyController.addReply);
router.get('/deletereply/:id/:id_reply',replyController.deleteReply);
router.get('/readreply/:id',replyController.readReply);
router.post('/editreply/:id/:id_reply',replyController.editReply);
router.get('/updatelike/:id_reply',replyController.updateLike);

module.exports = router;