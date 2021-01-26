const connect = require('../config/connect');
const universal = require('../config/universal');

//顯示他人資訊+是否與使用者為好友
const relation = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("relation")
    let id_user = req.params.id;
    let id_friend_user = req.params.id_friend;
    var relation = false;
    let sqlFriend = 'SELECT f.id_friend_user FROM friends f WHERE f.id_user  = ' + id_user + ' AND f.request = "accept"' +
        'UNION SELECT f.id_user FROM friends f  WHERE f.id_friend_user = ' + id_user + '  AND f.request = "accept"'

    let sqlUser = 'SELECT * FROM users WHERE id_user = ' + id_friend_user;

    try {

        let userFriends = await universal.connect(sqlFriend);
        console.log(userFriends);
        let othersResult = await universal.connect(sqlUser);
        if (userFriends != "") {
            for (let i = 0; i < userFriends.length; i++) {
                if (userFriends[i].id_friend_user == id_friend_user) {
                    relation = true;
                    break;
                }
            }
        }
        othersResult[0].relation = relation;
        let otherResult = othersResult[0];
        res.json({ errorCode: 200, data: { msg: "success", result: otherResult } });
    } catch (error) {
        console.log(error);
        res.json({ errorCode: 400, data: { msg: "error" } });
    }
}

//顯示使用者名字、頭貼、專注時間資訊
const userInfo = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let sqlUser = 'SELECT name,total_focus_time,img FROM users '
    try {
        res.json(await connect(sqlUser, null, 404, "Fail To Show"));
    } catch (error) {
        res.json(error);
    }
}


module.exports = {
    relation,
    userInfo
}