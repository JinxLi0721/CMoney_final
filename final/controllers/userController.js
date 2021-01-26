const con = require('../config');
const jwt = require('jsonwebtoken');
const salt = require('../config/salt');
const connect = require('../config/connect');
const fs = require('fs');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const mailgun = require('mailgun-js');
const { domain } = require('process');
const DOMAIN = 'sandboxf5e1f3a0441f4d8f823e7850e6bd36af.mailgun.org';
// const DOMAIN = 'sandbox49d1db566a554201b77641cdf2c73c7a.mailgun.org';

const api_key = 'ee4b156ed09f50e33379142838977e88-28d78af2-07743627';
// const api_key = '78035ac56b8c8728a1874d5286fb566e-28d78af2-8cd8bc44'
const pub_key = 'pubkey-f44f059bc65f0a3c7324c4f19b5cada7';
const api_key_ID = '28d78af2-07743627';
const mg = mailgun({ apiKey: api_key, domain: DOMAIN ,host:'smtp.mailgun.org',port:2525});
// const mailGunMail = `jinlidreams@${DOMAIN}`;
const mailGunMail = "jinxli2021@gmail.com";


//以下是註冊時將頭貼檔案存進mysql的版本
// const register = async function (req, res, next) {
//     res.header("Access-Control-Allow-Origin","*");
//     console.log('register');

//     let email = req.body.email;
//     let password = req.body.password;
//     let id_user = req.body.id;
//     let account = req.body.account;
//     let introduction = req.body.introduction;
//     // let img = req.file.buffer;
//     let img = req.body.img;
//     let identity = "general"
//     let name = req.body.name;
//     let day_focus_time = '0';
//     let week_focus_time = '0';
//     let total_focus_time = '0';
//     let registerDate = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString();
//     // let newPath = `uploads/${req.file.originalname}`;
//     // fs.rename(req.file.path, newPath, () => {
//     //     console.log("img upload successful");
//     // })
//     //let img =newPath;
//     // var img = req.file.path;                                                                          787

//     var ins = " INSERT INTO users VALUES ?";
//     var value = [[[id_user, email, account, password, name, registerDate, introduction,
//         total_focus_time, day_focus_time, week_focus_time, img]]];


//     try {
//         res.json(await connect(ins, value, "400", "Fail To Register"));
//     } catch (error) {

//         res.json(error);
//     }

// };

//註冊，將頭貼檔名存進mysql
const register = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log('register');

    let email = req.body.email;
    let password = req.body.password;
    let id_user = req.body.id;
    let account = req.body.account;
    let introduction = req.body.introduction;
    let name = req.body.name;
    let day_focus_time = '0';
    let week_focus_time = '0';
    let total_focus_time = '0';
    let registerDate = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString();
    //
    // let newPath = __basedir+`uploads/${req.file.originalname}`;
    // fs.rename(req.file.path, newPath, () => {
    //     console.log("img upload successful"+newPath);
    // })
    // var img = newPath;

    // var ins = " INSERT INTO users VALUES ?";
    // var value = [[[id_user, email, account, password, name, registerDate, introduction,
    //     total_focus_time, day_focus_time, week_focus_time, img]]];


    try {
        //由前端rename檔案名稱
        let img = req.body.img;
        if (req.file != null) {
            // let newPath = __basedir+`/uploads/${Date.now()+"_"+req.file.originalname}`;
            let newPath = __basedir + `/uploads/${req.file.originalname}`;
            // console.log(__basedir);
            // let newPath = Date.now()+`${req.file.originalname}`;
            fs.rename(req.file.path, newPath, () => {
                console.log("img upload successful" + newPath);
            })
            // var img = imgurl+`${Date.now()+"_"+req.file.originalname}`;
            img = `${req.file.originalname}`;
        }

        var ins = " INSERT INTO users VALUES ?";
        let value = [[[id_user, email, account, password, name, registerDate, introduction,
            total_focus_time, day_focus_time, week_focus_time, img]]];

        res.json(await connect(ins, value, "400", "Fail To Register"));
       
    } catch (error) {

        res.json(error);
    }


};


//使用帳號密碼登入
const login = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let email = req.body.email;
    let password = req.body.password;
    let account = req.body.account;
    let date = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString();

    var log = " SELECT * FROM users WHERE account = ? AND password = ?";
    con.query(log, [account, password], function (err, result) {
        console.log("err:" + err);
        // if (err) throw err;

        if (result == "") {
            res.json({ errorCode: 404, data: { msg: 'fail to login' } })
            return;
        }
        let token = jwt.sign({ userId: account }, salt.salt)
        console.log("result:" + result + "token:" + token);
        var info = {
            id_user: result[0].id_user,
            name: result[0].name,
            account: result[0].account,
            registerDate: result[0].registerDate,
            email: result[0].email,
            total_focus_time: result[0].total_focus_time,
            img:result[0].img

        }

        res.json({ errorCode: 200, data: { msg: 'success', info, token } })

    });
};

//token中介層
const verify = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (token) {
        try {
            let decode = jwt.verify(token, salt.salt);
            req.decode = decode;
            next();
            return;
        } catch (err) {
            res.json({ errorCode: 401, data: { msg: 'token expire!' } });
            return;
        }
    }
    res.json({ errorCode: 404, data: { msg: 'token Error!' } });
    return;
}

//忘記密碼時輸入信箱或帳號，確保是註冊過的資料
const forgetPassword = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let email = req.body.email;
    let account = req.body.account;
    let sqlSearch = 'SELECT email,account FROM users WHERE email = ? OR account = ?';
    try {
        res.json(await connect(sqlSearch, [email, account], 404, "Not Found"));
    } catch (error) {
        res.json(error);
    }
}

//可在mailGunMail收到任一信箱寄出的mail，用在網站中的contact us
const receiveEmail = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let email = req.body.email;
    let subject = req.body.subject;
    let text = req.body.text;
    console.log("send");
    const auth = {
        auth: {
            api_key: api_key,
            // api_key:pub_key,
            domain: DOMAIN
        }
    }
    const transporter = nodemailer.createTransport(mailGun(auth));
    var mailOptions = {
        from: email,
        to: mailGunMail,
        subject: subject,
        text: text
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            res.json({ errorCode: 400, data: { err } });
        } else {
            console.log(info);
            res.json({ errorCode: 200, data: { msg: "success" } });
        }
    })

}


// const data = {
//     from: 'JoStudy <jinxli2021@gmail.com>',
//     to: '<jinxli2021@gmail.com>',
//     subject: 'Hello',
//     text: 'Testing some Mailgun awesomness!'
// };
// mg.messages().send(data, function (error, body) {
//     console.log("body:"+body+"data:"+data);
// });
// }



// var transporter = nodemailer.createTransport({
//     service:'Gmail',
//     host: "smtp.gmail.com",
//     auth:{
//         user:'jinxli2021@gmail.com',
//         pass:'xu85770747mvmp'

//     }
// });

// var options = {
//     from :'jinxli2021@gmail.com',
//     to :email,
//     cc:'p0929513319@gmail.com',
//     subject:"這是測試信",
//     text:"hi hello world"
// }
// transporter.sendMail(options,function(err,info){
//     if(err){
//         return res.json(err);
//     }
//     res.json(info);
// })




//忘記密碼時寄出email到使用者信箱中，但失敗
const sendEmail = async function (req, res, next) {
    let email = req.body.email;

    console.log("send");
    var mailOptions = {
        from: mailGunMail,
        to: email,
        subject: "Test",
        text: "加油啊!"
    }

    await mg.messages().send((mailOptions), function (err, body) {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            console.log(body);
            res.json(body);
        }
    })

}






module.exports = {
    register,
    login,
    verify,
    forgetPassword,
    receiveEmail,
    sendEmail//失敗

};