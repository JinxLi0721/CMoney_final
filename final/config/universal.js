const con = require("../config");
const multer = require('multer');


let genStrID = function (length,number) {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now()+number; //use high-precision timer if available
        console.log(performance.now());
    }
    // var r = Math.random().toString(16).substr(3,length);

    d = d.toString(2).substr(Math.random() * 5, length);
    return d;
};

let genIntID = function(id,int,prime){//9973、999,983
    let newID = id*Math.pow(int,7)%prime;
    return newID;
}
let dateTrans = function(key,value){
    if(key == "registerDate"){
        return value.substr(0,10);
    }
    return value;
  }
let milesecondTransMin = function(milesecond){//計算使用者上線時間
    return Math.floor(milesecond/1000/60);
}
let minTransMilesecond = function(min){
    return min*1000*60;
}

let timeTransMilesecond = function(time){
    timeArray = time.split(":");
    console.log(timeArray);
    let date = timeArray[0]*1000*60*60+timeArray[1]*1000*60+timeArray[2]*1000;
    // let date = new Date(0,0,0,timeArray[0],timeArray[1],timeArray[2]);
    console.log(date);

    return date;
}
let milesecondTransTime =function remain_time_string (milesecond) {
    var hours = Math.floor(milesecond / 1000 / 60 / 60);
    milesecond -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(milesecond / 1000 / 60);
    milesecond -= minutes * 1000 * 60;
    var seconds = Math.floor(milesecond / 1000);
    resultTime = hours + ":" + minutes + ":" + seconds;
    return resultTime;
  }
let connect = function(sqlString){
    return new Promise((res,rej)=>{
        con.query(sqlString,function(err,reply){
            if(err){
                rej(err);
            }else{
                res(reply);
            }
        })
    })
}
const upload = multer({
    storage: multer.diskStorage({
        destination:(req,file,callback)=>{
            callback(null,__basedir+'/uploads/');
        },
        filename:(req,file,callback)=>{
            console.log(file.originalname);
            callback(null, file.originalname+"_"+Date.now())
        },
    }),
    limits: {
        fileSize: 3000000,
    },
    fileFilter(req, file, callback) {
        if (!file.mimetype.match(/^image/)) {
            callback(new Error().message = 'Please upload an image');
        } else {
            callback(null, true);
        }
    }
});   
const failUpload = (error,req,res,next)=>{
    // res.status(400).send({error:error.message})
    res.json({ errorCode: 400, data: { msg: "error", error:error.message } })
}


// console.log(_uuid(5));c

module.exports = {
    genID: genStrID,
    genIntID,
    dateTrans,
    milesecondTransMin,
    minTransMilesecond,
    timeTransMilesecond,
    milesecondTransTime,
    connect,
    upload,
    failUpload
};