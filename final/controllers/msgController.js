const mysql = require('mysql');
const connect = require('../config/connect');


//教室留言板，已棄用，改成question與reply

let addMsg = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    let id_user = req.params.id;
    let id_room = req.params.id_room;
    let id_message = req.body.id_message;
    let message = req.body.message;
    // 判斷user

    let user = "SELECT * FROM users  WHERE id_user = " + mysql.escape(id_user);
    let sqlRoom = "SELECT id_room FROM study_rooms WHERE id_room = "+mysql.escape(id_room);
    let sqlInsertMsg = "INSERT INTO messages VALUES ?";
    let sqlShowMsg = "SELECT u.name,u.id_user,m.message,m.id_message FROM messages m JOIN users u ON m.id_user = u.id_user AND id_room = " + id_room;

    try {
        console.log("userInfo");
        //   res.header("Access-Control-Allow-Origin","*");

        let userInfo = await connect(user, null, 404, "user not found");
        await connect(sqlRoom,null,404,"StudyRoom doesn't exist");
        let valueInsertMsg = [[[id_message, id_room, id_user, message]]];
        await connect(sqlInsertMsg, valueInsertMsg, 400, "fail insert");
        res.json(await connect(sqlShowMsg, null, 400, "fail to show"));

    } catch (error) {
        res.json(error);
    }


}
let deleteMsg = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    let id_user = req.params.id;
    let id_message = req.params.id_message;
    
    let sql = 'DELETE FROM messages WHERE id_message = ? AND id_user = ? ' ;

    try {
        res.json(await connect(sql, [id_message,id_user],404, "You Are Not the User"));
    } catch (error) {
        res.json(error);
    }

}

let showMsg = async function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    let id_room = req.params.id_room;
    console.log("show");
    let sqlRoom = "SELECT id_room FROM study_rooms WHERE id_room = "+mysql.escape(id_room);
    let sqlShowMsg = 'SELECT u.name,u.id_user,m.message,m.id_message FROM messages m JOIN users u ON m.id_user = u.id_user AND id_room = ' + id_room;
  
    try {
        await connect(sqlRoom,null,404,"StudyRoom doesn't exist");
        res.json(await connect(sqlShowMsg,400,"Fail To Show"));
    } catch (error) {
        res.json(error);
    }
} 

module.exports = {
    addMsg,
    deleteMsg,
    showMsg
}