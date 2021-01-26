const con = require('../config');
const mysql = require('mysql');
const multer = require('multer');
const connect = require('../config/connect');
const fs = require('fs');


//顯示使用者所有資訊
const information = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.set('Content-Type', 'image/png');
    let id = req.params.id;
    var sql = "SELECT * FROM users  WHERE id_user = " + mysql.escape(id);
    con.query(sql, function (err, result) {
        console.log("result:\n" + result);
        if (result == "" | err) {
            res.json({ errorCode: 404, data: { msg: 'Not found' } });
            return;
        }
        let name = result[0].name;
        let email = result[0].email;
        let registerDate = result[0].registerDate;
        let account = result[0].account;
        let introduction = result[0].introduction;
        let total_focus_time = result[0].total_focus_time;
        let img = result[0].img;
        // img = Buffer.from(img).toString('base64');
        var userInfo = {
            name,
            account,
            email,
            introduction,
            total_focus_time,
            registerDate,
            img
        }
        // console.log(result[0].name+"\n"+result[0].email+"\n"
        // +result[0].registerDate );
        res.json({ errorCode: 200, data: { msg: "success", result: userInfo } });
    });
}

//只顯示頭貼、名字
const display = async function (req, res) {
    let id_user = req.params.id;

    let sqlId = 'SELECT name,img FROM users WHERE id_user = ' + id_user;
    try {
        let result = await connect(sqlId, null, 404, "no information");
        // let imgPath
        res.json(result);
    } catch (error) {
        res.json(error);
    }
}


//原本要將這個方法放在saveImg裡面，但會造成req.body是空的，所以沒有使用
//而是將universal.upload放在api的中介層
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.mimetype.match(/^image/)) {
            callback(new Error().message = 'Please upload an image');
        } else {
            callback(null, true);
        }
    }
});



//將照片用buffer存建mysql
// const saveImg = async function(req,res,next){
//     res.header("Access-Control-Allow-Origin", "*");
//     let id_user = req.params.id;
//     let sqlImg = 'UPDATE users SET img = ? WHERE id_user = ?';
//     try {
//         res.json(await connect(sqlImg,[req.file.buffer,id_user],400,"Fail To Upload"));
//     } catch (error) {
//         res.json(error);
//     }
// }


//編輯時上傳圖片
const saveImg = async function (req, res, next) {
    let id_user = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");
    let sqlImg = 'SeLECT img FROM users WHERE id_user = ' + id_user;

    try {
        //定義圖片要存在哪個資料夾路徑
        let newPath = __basedir + `/uploads/${Date.now() + "_" + req.file.originalname}`;
        //改變圖片名稱
        fs.rename(req.file.path, newPath, () => {
            console.log("img upload successful" + newPath + "req.file.path:" + req.file.path);
        })
        //將圖片名稱存在mysql
        // var img = imgurl + `${Date.now() + "_" + req.file.originalname}`;
        var img = `${Date.now() + "_" + req.file.originalname}`;
        let sqlSaveImg = 'UPDATE users SET img = ? WHERE id_user = ' + id_user;
        await connect(sqlSaveImg, img, 400, "Fail To Update")
        let imgpath = await connect(sqlImg, null, 404, "Not Found");
        let result = imgpath.data.result[0];

        res.json({ errorCode: 200, data: { msg: "success", result } });
    } catch (error) {
        res.json(error);
    }
}

//刪除mysql裡的圖片路徑，與upload資料夾內的圖片
const deleteImg = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let sqlImg = 'SELECT img FROM users WHERE id_user = ' + id_user;
    let sqlDelete = 'UPDATE users SET img = null WHERE id_user =' + id_user;
    try {
        let result = await connect(sqlImg, null, 404, "Not Found");
        let imgNmae = result.data.result[0].img;
        fs.unlink(__basedir + '/uploads/' + imgNmae, function () {
            console.log("delete success");
        })
        res.json(await connect(sqlDelete, null, 400, "Fail To Delete"));

    } catch (error) {
        res.json(error);
    }

}




//編輯使用者資訊
const edit = async function (req, res,) {
    res.header("Access-Control-Allow-Origin", "*");
    let name = req.body.name;
    let id = req.params.id;
    let introduction = req.body.introduction;
    let email = req.body.email;

    var sql = "UPDATE users SET name =? , introduction = ? , email = ? WHERE id_user = " + mysql.escape(id);
    let editResult = {
        name,
        introduction,
        email
    }
    try {
        await connect(sql, [name, introduction, email, id], 400, "Fail To Edit")

        res.json({ errorCode: 200, data: { msg: "success", result: editResult } });
    } catch (error) {
        res.json(error);
    }
}


//編輯密碼
const editPassword = function (req, res,) {
    res.header("Access-Control-Allow-Origin", "*");
    let password = req.body.password;
    let oldPwd = req.body.oldPwd;
    let id = req.params.id;
    let sqlConfirm = 'SELECT password FROM users WHERE id_user = ' + id;
    var sql = "UPDATE users SET password =? WHERE id_user = " + mysql.escape(id);
    //先取出舊密碼，看與使用者輸入是否一樣
    con.query(sqlConfirm, function (err, result) {
        if (result == "" | err | result.affectedRows == 0) {
            res.json({ errorCode: 404, data: { msg: 'Not Found' } });
            return;
        }
        if (result[0].password == oldPwd) {
            con.query(sql, [password], function (err, result) {

                if (result == "" | err | result.affectedRows == 0) {
                    res.json({ errorCode: 404, data: { msg: 'fail to edit' } });
                    return;
                }
                console.log("result:\n" + result);
                return res.json({ errorCode: 200, data: { msg: 'success' } });

            })
        }
    })
}


module.exports = {
    edit,
    editPassword,
    information,
    upload,
    saveImg,
    display,
    deleteImg
};
