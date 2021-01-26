const universal = require('../config/universal');
const connect = require('../config/connect');



//新增問題
const askQuestion = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_room = req.params.id_room;
    let id_question = req.body.id_question;
    let question = req.body.question;
    let reply_like = '0';
    let sqlAsk = 'INSERT INTO questions VALUES ?'
    let date = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString();
    let valueAsk = [[[id_question,id_user,id_room,question,reply_like,date]]]
    try {
        res.json(await connect(sqlAsk,valueAsk,400,"Fail To Ask"));
    } catch (error) {
        res.json(error);
    }
}

//刪除自己新增的問題
const deleteQuestion = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_question = req.params.id_question;
    let sqlDelete = 'DELETE FROM questions WHERE id_question_user = ? AND id_question = ?';
    try {
        res.json(await connect(sqlDelete,[id_user,id_question],400,"You Have No Authority"));
    } catch (error) {
        res.json(error);
    }
}

//編輯自己的問題內容
const editQuestion = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_question = req.params.id_question;
    let question = req.body.question;
    let sqlEdit = 'UPDATE questions SET question = ? WHERE id_question = ? AND id_question_user = ?';
   
    try {
        res.json(await connect(sqlEdit,[question,id_question,id_user],400,"You Have No Authority"));
    } catch (error) {
        res.json(error);        
    }

}

//顯示使用者自己問過的所有問題+他人的回答
const readQuestion = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let reply = [];

    let sqlRead = 'SELECT q.*,u.name,u.img FROM questions q JOIN users u ON q.id_question_user = u.id_user WHERE id_question_user = '+id_user;
    try {
        var userInfo = await connect(sqlRead,null,404,"You Did Not Ask Any Questions");

        let allQuestion = userInfo.data.result;

        for (let i = 0; i < allQuestion.length; i++) {
            let id_q = allQuestion[i].id_question;
            // let sqlReply = sql.select("*").from("replies").where("id_question = " + id_q).gen();
            let sqlReply = 'SELECT r.*,u.name,u.img FROM replies r JOIN users u ON r.id_reply_user = u.id_user WHERE id_question = '+id_q;

            // connect(sqlShowReply,id_q,404,"no reply");
            let resultR = await universal.connect(sqlReply);
            // console.log(resultR.data.result);
            reply = [];
            reply = resultR;
            allQuestion[i].reply = reply;
        }

        console.log(allQuestion);
        res.json({ errorCode: 200, data: {msg: "success",result:allQuestion } });
    } catch (error) {
        res.json(error);
    }
}


//對問題按讚
const updateLike = async function(req,res,next){//沒有記錄按讚的有誰
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_question = req.params.id_question;
    let sqlLike = 'UPDATE questions SET question_like = ? WHERE id_question = '+id_question;
    let sqlRead = 'SELECT * FROM questions WHERE id_question = '+id_question;
    
    try {
        var userInfo = await connect(sqlRead,null,404,"There is no Questionos");
        let originLike = userInfo.data.result[0].question_like+1;
        res.json(await connect(sqlLike,originLike,400,"Fail To Like"));
    } catch (error) {
        res.json(error);
        
    }
}


module.exports = {
    askQuestion,
    deleteQuestion,
    editQuestion,
    readQuestion,
    updateLike
}