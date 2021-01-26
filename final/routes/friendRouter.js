var express = require('express');
var router = express.Router();

const friendController = require('../controllers/friendController');

router.get('/sendrequest/:id/:id_friend_user',friendController.sendRequest);
router.get('/refuse/:id/:id_friend_user',friendController.refuse);
router.get('/accept/:id/:id_friend_user',friendController.accept);
router.get('/deletefriend/:id/:id_friend_user',friendController.deleteFriend);
router.get('/allfriends/:id',friendController.allFriends);
router.get('/allberefused/:id',friendController.allBeRefused);
router.get('/allrefuse/:id',friendController.allRefuse);
router.get('/allsend/:id',friendController.allSend);




module.exports = router;