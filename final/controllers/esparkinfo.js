var http = require('http');

var path = require('path');

var express = require('express');

var router = express();

var server = http.createServer(router);

router.use('/client', express.static(path.resolve(__dirname, 'client')));

// router.get('/data', function (req, res, next) {

//     return res.json('hello world');

// });

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function () {

    var addr = server.address();

    console.log('服務器正在監聽', addr.address + '：' + addr.port);

});


router.get('/data', function (req, res, next) {
    const time = (new Date()).getTime();
    let second = Math.random() * 10000;
    if (second < 1000) {
        return res.json({ hasValue: false, value: null });
    }
    if (second > 8000) {
        second = 60000;
    }

    console.log("waiting second before responding", second);
    return setTimeout(function () {


        return res.json({ hasValue: true, value: time });
    }, second);


});

