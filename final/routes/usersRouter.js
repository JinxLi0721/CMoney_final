var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const universal = require('../config/universal');


/* GET users listing. */

router.post('/register',universal.upload.single('image'),userController.register,universal.failUpload);
// router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/forgetpassword',userController.forgetPassword);
router.post('/sendemail',userController.sendEmail);
router.post('/receiveemail',userController.receiveEmail);



module.exports = router;
