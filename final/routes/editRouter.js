'use strict';
var express = require('express');
var router = express.Router();

const universal = require('../config/universal');

const editController = require('../controllers/editController');


router.post('/edit/:id',editController.edit);
router.get('/information/:id',editController.information);
router.post('/editpassword/:id',editController.editPassword);
// router.post('/upload/:id',editController.upload.single('image'),editController.saveImg);
router.post('/saveimg/:id',universal.upload.single('image'),editController.saveImg,universal.failUpload);
router.get('/display/:id',editController.display);
router.get('/deleteimg/:id',editController.deleteImg);

module.exports = router;