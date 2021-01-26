const mysql = require('mysql');
const connect = require('../config/connect');


//寄出信件
const sendLetter = async function(req,res,next){
    
    res.header("Access-Control-Allow-Origin","*");
    console.log("send");
    let id_send_user = req.params.id;//使用者本人為寄件者
    // let id_user = req.body.id_send_user;//要寄給收信者
    let name = req.body.name;//要寄給收件者名字
    let account = req.body.account;
    let letter_title = req.body.letter_title;
    let content = req.body.content;
    let read = 0;
    let id_letter = req.body.id_letter;

    //搜尋出好友名字或帳號
    let sqlUser = "SELECT id_user FROM users WHERE name = ? OR account = ? ";

    //顯示所有好友
    let sqlAllFriends = 'SELECT f.id_friend_user,u.name FROM friends f JOIN users u ON f.id_friend_user = u.id_user WHERE f.id_user  = ? AND f.request = "accept"'+
    'UNION SELECT f.id_user,u.name FROM friends f JOIN users u ON f.id_user = u.id_user WHERE f.id_friend_user = ? AND f.request = "accept"';
    
    //將信件內容存入資料庫
    let sql ='INSERT INTO letters VALUES ?';
    

    try {
        let userResult = await connect(sqlUser,[name,account],404,"Cannot find this user");
        console.log(userResult.data.result[0].id_user);
        let sendTo = userResult.data.result[0].id_user;
        res.json(await connect(sqlAllFriends,[id_send_user,id_send_user],404,"He/She is not Your Friend"));
        let valueInsertLetter = [[[id_letter,sendTo,id_send_user,letter_title,content,read]]]
        await connect(sql,valueInsertLetter,400,"Fail to send");

    } catch (error) {
        res.json(error);
    }


}

//使用者刪除收到的信件
const deleteLetter = async function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    let id_user = req.params.id;
    let id_letter = req.params.id_letter;
    let sql ='DELETE FROM letters WHERE id_letter = ? AND id_user = ? ';
    try {
        res.json(await connect(sql,[id_letter,id_user],404,"You Are Not The User"));

    } catch (error) {
        res.json(error);
    }
}

//使用者收到的所有信件
const inbox =async function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    let id_user = req.params.id;
    let sql = 'SELECT * FROM letters WHERE id_user = '+mysql.escape(id_user)+'ORDER BY id_letter DESC';

    try {
        res.json(await connect(sql,null,404,"You Have No Letters"));
    } catch (error) {
        res.json(error);
    }
}

//已讀收到的信件
const read = async function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    let id_user = req.params.id;
    let id_letter = req.params.id_letter;
    let sql = "UPDATE letters l SET l.read = 1 WHERE id_letter = ? AND id_user = ?";

    try {
        res.json(await connect(sql,[id_letter,id_user],404,"Fail to Read"));

    } catch (error) {
        res.json(error);
    }


}


module.exports = {
    sendLetter,
    deleteLetter,
    inbox,
    read

}

