var express = require('express');
var router = express.Router();
var longPollingRoute = function(request, response, next){

    var start = new Date();
    var ret = {
        list: []
    };

    var defaultRes = JSON.stringify(ret);

    function polling(req, res){
        var date = new Date();

        //超過20秒

        if(parseInt(date - start) > 20000) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(defaultRes);
            return false;
        }

        //do something, 例如說去資料庫拿資料

        var hasData = getSomething();
        if(hasData){

            //把資料送回client

            res.writeHead(200, {'Content-Type': 'text/plain'});
            ret.list = list;
            res.write(JSON.stringify(ret));
            res.end();
            ret.list = [];
            return false;
        }

        //10秒鐘重複抓一次

        setTimeout(function(){ 
            polling(request, response) 
        }, 10000);
    }
 
    polling(request, response);    
}

router.route('/longPolling').get(longPollingRoute);