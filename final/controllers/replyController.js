const connect = require('../config/connect');



//新增回答
const addReply = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_reply = req.body.id_reply;
    let reply = req.body.reply;
    let reply_like = '0';
    let id_question = req.params.id_question;
    let sqlQuestion = 'SELECT * FROM questions q  WHERE id_question = ' + id_question;
    let sqlAdd = 'INSERT INTO replies VALUES ?';
    let sqlReply = 'SELECT r.*,u.name,u.img FROM replies r JOIN users u ON r.id_reply_user = u.id_user WHERE id_question =  ' + id_question;

    let valueAdd = [[[id_reply, id_user, id_question, reply, reply_like]]]
    try {
         await connect(sqlQuestion, null, 404, "There is no question");
        await connect(sqlAdd, valueAdd, 400, "Fail To Reply");
        res.json( await connect(sqlReply,404,"Fail To Show Reply"));
       

    } catch (error) {
        res.json(error);
    }
}


//編輯自己的回答
const editReply = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_reply = req.params.id_reply;
    let reply = req.body.reply;
    let sqlEditReply = 'UPDATE replies SET reply  = ? WHERE id_reply = ? AND id_reply_user = ?';
    try {
        res.json(await connect(sqlEditReply, [reply, id_reply, id_user], 400, "Fail To Edit"));
    } catch (error) {
        res.json(error);
    }
}

//顯示使用者所有的回答(未顯示此回答的問題)
const readReply = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let sqlReadReply = 'SELECT r.*,u.name,u.img FROM replies r JOIN users u ON r.id_reply_user = u.id_user WHERE id_reply_user = ' + id_user;

    // let reply = [];
    try {
        res.json(await connect(sqlReadReply, null, 404, "You Did Not Answer Any Question "));
    } catch (error) {
        res.json(error);
    }
}

//刪除使用者自己的回答
const deleteReply = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_reply = req.params.id_reply;
    let sqlDeleteReply = 'DELETE FROM replies WHERE id_reply = ? AND id_reply_user = ?';
    try {
        res.json(await connect(sqlDeleteReply, [id_reply, id_user], 400, "You Have No Authority"));
    } catch (error) {
        res.json(error);
    }
}

//對回答按讚
const updateLike = async function (req, res, next) {//未記錄按讚的有誰
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_reply = req.params.id_reply;
    let sqlLike = 'UPDATE replies SET reply_like = ? WHERE id_reply = ' + id_reply;
    let sqlRead = 'SELECT * FROM replies WHERE id_reply = ' + id_reply;

    try {
        var userInfo = await connect(sqlRead, null, 404, "There is no reply");
        let originLike = userInfo.data.result[0].reply_like + 1;
        res.json(await connect(sqlLike, originLike, 400, "Fail To Like"));
    } catch (error) {
        res.json(error);

    }
}





module.exports = {
    addReply,
    editReply,
    deleteReply,
    readReply,
    updateLike
}