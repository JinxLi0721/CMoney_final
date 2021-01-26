var express = require('express');
var router = express.Router();

const questionController = require('../controllers/questionController');

router.post('/askquestion/:id/:id_room',questionController.askQuestion);
router.get('/deletequestion/:id/:id_question',questionController.deleteQuestion);
router.get('/readquestion/:id',questionController.readQuestion);
router.post('/editquestion/:id/:id_question',questionController.editQuestion);
router.get('/readquestion/:id',questionController.readQuestion);
router.get('/updatelike/:id_question',questionController.updateLike);

module.exports = router;