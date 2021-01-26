var express = require('express');
var router = express.Router();
// const mysql = require("mysql");
var con = require("../config")
const mainRouter = require('./mainRouter');
const usersRouter = require('./usersRouter');
const editRouter = require('./editRouter');
const roomtRouter = require('./roomRouter');
const pomodoroRouter = require('./pomodoroRouter');
const userController = require('../controllers/userController');
const letterRouter = require('./letterRouter');
const msgRouter = require('./msgRouter');
const friendRouter = require('./friendRouter');
const questionRouter = require('./questionRouter');
const replyRouter = require('./replyRouter');
const informationRouter = require('./informationRouter');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use('/',mainRouter);
router.use('/user',usersRouter);
// router.use(userController.verify);
router.use('/edit',editRouter);
router.use('/studyroom',roomtRouter);
router.use('/pomodoro',pomodoroRouter);
router.use('/letter',letterRouter);
router.use('/message',msgRouter);
router.use('/friend',friendRouter);
router.use('/question',questionRouter);
router.use('/reply',replyRouter);
router.use('/information',informationRouter);








// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "n331437xu",
//   port: 3306,
//   database: "test1_schema"
// });

router.get('/this', function(req, res, next) {
  var ins = " INSERT INTO test1_table VALUES (6,'title','subtitle','author');";

  con.query(ins, function (err, result) {
      if (err) throw err;
      res.send("inserted");
  });

});

module.exports = router;
