var express = require('express');
var router = express.Router();

const informationController = require('../controllers/informationController');

router.get('/relation/:id/:id_friend',informationController.relation);
router.get('/userInfo',informationController.userInfo);

module.exports = router;