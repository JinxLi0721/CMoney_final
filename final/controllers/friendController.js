const con = require('../config');
const connect = require('../config/connect');


//寄出交友邀請
const sendRequest = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_friend_list = req.body.id_friend_list;
    let id_user = req.params.id;
    let id_friend_user = req.params.id_friend_user;
    let sqlSearch = 'SELECT * FROM friends WHERE id_user = ? AND id_friend_user = ?';
    let sqlInsertRequest = "INSERT INTO friends VALUE  ?";
    let valueInsertRequest = [[[id_friend_list, id_user, id_friend_user, 'send']]];

    try {
        con.query(sqlSearch, [id_user, id_friend_user], async function (error,result) {
            // console.log(result);
            if (result == "" || result == null) {
                res.json(await connect(sqlInsertRequest, valueInsertRequest, 400, "Fail to Insert"));
                return;
            } res.json({ errorCode: 400, data: { msg: 'You Haved Send Request' } })
        })

    } catch (error) {
        res.json(error);
    }

}


//拒絕交友邀請
const refuse = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_friend_user = req.params.id;//使用者本人是收到邀請的朋友
    let id_user = req.params.id_friend_user;
    let sqlRefuse = 'UPDATE friends SET request = "refuse" WHERE id_user = ? AND id_friend_user = ? AND request = "send"';
    try {
        res.json(await connect(sqlRefuse, [id_user, id_friend_user], 400, "Fail to refuse"));
    } catch (error) {
        res.json(error);
    }
}

//接受交友邀請
const accept = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_friend_user = req.params.id;
    let id_user = req.params.id_friend_user;
    let sqlAccept = 'UPDATE friends SET request ="accept" WHERE id_user = ? AND id_friend_user = ? AND request = "send"';
    try {
        res.json(await connect(sqlAccept,[id_user,id_friend_user],400,"Fail to accept"));
    } catch (error) {
        res.json(error);
    }

}

//刪除好友
const deleteFriend = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_friend_user = req.params.id_friend_user;
    let sqlDelete = 'DELETE FROM friends WHERE ((id_user = ? AND id_friend_user = ?) OR (id_user = ? AND id_friend_user = ?) ) AND request = "accept"';
    try {
        res.json(await connect(sqlDelete,[id_user,id_friend_user,id_friend_user,id_user],400,"Fail To Delete"));
    } catch (error) {
        res.json(error);
    }
}


//顯示使用者本身的所有好友
const allFriends = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let sqlAllFriends = 'SELECT f.id_friend_user,u.name FROM friends f JOIN users u ON f.id_friend_user = u.id_user WHERE f.id_user  = ? AND f.request = "accept"'+
    'UNION SELECT f.id_user,u.name FROM friends f JOIN users u ON f.id_user = u.id_user WHERE f.id_friend_user =? AND f.request = "accept"';
    try {
        res.json(await connect(sqlAllFriends,[id_user,id_user],400,"there is no data"));

    } catch (error) {
        res.json(error);
    }

}

//顯示所有拒絕使用者寄出的好友邀請
const allBeRefused = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let sqlAllFriends = 'SELECT f.id_friend_user,u.name FROM friends f JOIN users u ON f.id_friend_user = u.id_user WHERE f.id_user  = ? AND f.request = "refuse"';

    try {
        res.json(await connect(sqlAllFriends,[id_user,id_user],400,"there is no data"));

    } catch (error) {
        res.json(error);
    }

}

//顯示所有使用者拒絕的好友邀請
const allRefuse = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let sqlAllFriends = 'SELECT f.id_user,u.name FROM friends f JOIN users u ON f.id_user = u.id_user WHERE f.id_friend_user =? AND f.request = "refuse"';
  
    try {
        res.json(await connect(sqlAllFriends,[id_user,id_user],400,"there is no data"));

    } catch (error) {
        res.json(error);
    }

}

//顯示所有使用者寄出但未收到回覆的好友邀請
const allSend = async function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let sqlAllFriends = 'SELECT f.id_friend_user,u.name FROM friends f JOIN users u ON f.id_friend_user = u.id_user WHERE f.id_user =? AND f.request = "send"';
  
    try {
        res.json(await connect(sqlAllFriends,[id_user,id_user],400,"there is no data"));

    } catch (error) {
        res.json(error);
    }

}

module.exports = {
    sendRequest,
    refuse,
    accept,
    deleteFriend,
    allFriends,
    allBeRefused,
    allRefuse,
    allSend
}