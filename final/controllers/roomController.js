const con = require('../config');
const mysql = require('mysql');
const universal = require('../config/universal');
const client = require('../config/redisCon');
const redisCommand = require('../config/RedisCommand');
const connect = require('../config/connect');

//原本教室ID要使用uuid，但太長了，未使用
//後來只使用workbench裡auto產出的ID
var _uuid = {
    uuid: function () {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}


//純粹新增教室
const addRoom = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // 判斷user
    let members = [];
    let id_user = req.params.id;
    let sqlUser = "SELECT id_user,name,registerDate,total_focus_time FROM users  WHERE id_user = " + mysql.escape(id_user);
    let id_room = req.body.id_room;
    let room_description = req.body.room_description;
    let room_name = req.body.room_name;
    let sqlInsertRoom = "INSERT INTO study_rooms VALUES ?";
    let room_focus_min = req.body.room_focus_min;
    let room_rest_min = req.body.room_rest_min;
    let establish_time = new Date().getTime() ;
    // let state_of_concentration = 1;//專注中ture
    let nowMilesecond = new Date().getTime();

    let valueInsertRoom = [[[id_room, room_name, id_user, room_description,
        room_focus_min, room_rest_min, establish_time]]];

    try {
        //取使用者資料
        let userResult = await connect(sqlUser, null, 404, "wrong user");
        let userInfo = userResult.data.result[0];
        console.log("userInfo" + userInfo);
        //判斷若使用者上線時間<8小時，則不能創建自習室
        if (universal.timeTransMilesecond(userInfo.total_focus_time) < 28800000) {
            res.json({ errorCode: 400, data: { msg: "You Have No Authority" } });
            return;
        }

        // //將使用者資料轉成字串來存進redis
        // let user = JSON.stringify(userInfo, universal.dateTrans);


        //insert 自習室資料
        console.log("result");
        let roomResult = await connect(sqlInsertRoom, valueInsertRoom, 400, "insert wrong");
        console.log("result" + roomResult);
        //for fort存入id_room、roomname進redis的有序list
        let id_room = roomResult.data.result.insertId;
        await redisCommand.lpush("id_room", id_room);
        await redisCommand.set("roomname_" + id_room, room_name);
        console.log(roomResult.data.result.insertId);
        console.log(roomResult);
        let roomInfo = {
            id_room,
            room_name,
            room_focus_min,
            room_rest_min,
            establish_time
        }
        res.json({ errorCode: 200, data: { msg: "success", result: roomInfo } });


        //以下是讓使用者進入教室
        //原本是新增教室後，要直接讓新增教室的使用者進入教室，但後來想讓API單純，所以將進入教室的code分開
        // //取自習室id
        // let id_room = roomResult.data.result.insertId;

        // //包裝自習室格式，若包裝自習室格式，若room_description未填給予預設值("")
        // if (typeof room_description == 'undefined') {
        //     var room_info = {
        //         id_room,
        //         room_name,
        //         id_user,
        //         room_description: '',
        //         name: userResult.data.result[0].name
        //     }
        // } else {
        //     var room_info = {
        //         id_room,
        //         room_name,
        //         id_user,
        //         room_description,
        //         name: userResult.data.result[0].name
        //     }
        // }
        // //將使用者加入redis
        // await redisCommand.sadd(id_room, user);

        // //將使用者進入教室的時間毫秒存進redis
        // await redisCommand.hset("user", id_user, nowMilesecond);

        // //取出自習室裡的成員
        // client.SMEMBERS(id_room, function (err, result) {
        //     if (err) {
        //         res.json({ errorCode: 400, data: { msg: 'Fail to Entry', err } });
        //         return
        //     }
        //     for (let i = 0; i < result.length; i++) {
        //         members.push(JSON.parse(result[i]));
        //     }

        //     res.json({
        //         errorCode: 200,
        //         data: {
        //             msg: "success",
        //             result: {
        //                 "room_info": room_info,
        //                 "users:": members
        //             }
        //         }
        //     })
        // });

    } catch (error) {
        res.json(error);
    }
};

//更改教室的專注與休息時間
const roomSetting = async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let room_focus_min = req.body.room_focus_min;
    let room_rest_min = req.body.room_rest_min;
    // let room_description = req.body.room_description;
    let id_user = req.params.id;
    let id_room = req.params.id_room;
    let sqlUpdateRoomTime = 'UPDATE study_rooms SET room_focus_min = ?, room_rest_min = ? WHERE id_room = ?';
    let sqlRoom = 'SELECT * FROM study_rooms WHERE id_room = ' + id_room;
    // let valueUpdateRoomTime = [[[room_focus_min, room_rest_min, id_room]]];
    let lastTime = 0;
    console.log("lastTime")
    try {
        let result = await connect(sqlRoom, null, 404, "Not Found");
        let roomResult = result.data.result;
        let roomInfo = roomResult[0];
        console.log(roomInfo);
        let focus_min = roomResult[0].room_focus_min;
        let rest_min = roomResult[0].room_rest_min;
        let establish_time = roomResult[0].establish_time;
        console.log(establish_time);
        let focus_sec = universal.minTransMilesecond(focus_min);
        let rest_sec = universal.minTransMilesecond(rest_min);
        console.log("focus_sec:" + focus_sec + "rest_sec:" + rest_sec);
        let modTime = (Date.now() - establish_time) % (focus_sec + rest_sec);
        lastTime = Date.now() + (focus_sec + rest_sec - modTime);
        console.log(lastTime);
        roomInfo.lastTime = lastTime;
        console.log(roomInfo);

        await connect(sqlUpdateRoomTime, [room_focus_min, room_rest_min, id_room], 400, "Fail To Update");
        res.json({ errorCode: 200, data: { msg: "success", result: roomInfo } });

    } catch (error) {
        res.json(error);
    }
}

//顯示所有教室列表
const roomlist = function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    let room_contain_array = [];
    let state = true;
    let rooms = "SELECT s.*,u.name,u.img,u.introduction,u.registerDate FROM study_rooms s JOIN users u ON s.id_user = u.id_user"
    con.query(rooms, async function (err, result) {
        if (result == "" | typeof result == "undefined" | err) {
            res.json({ errorCode: 400, data: { msg: "there is no studyroom ", result } })
            return;
        }
        console.log("result.length" + result.length);
        //取出redis對應id_roome的key，並回傳key裡有多少members作為自習室內人數
        try {
            for (let t = 0; t < result.length; t++) {
                console.log(result[t].id_room);
                console.log(await redisCommand.scard(result[t].id_room));
                let contain = await redisCommand.scard(result[t].id_room)
                console.log("contain:" + contain);
                room_contain_array.push(contain)
                //================================

                let room_focus_min = result[t].room_focus_min;
                let room_rest_min = result[t].room_rest_min;
                let establish_time = result[t].establish_time;
                // console.log("room_focus_min:" + room_focus_min + "room_rest_min:" + room_rest_min + "next_ronud_time" + establish_time);
                let focus_sec = universal.minTransMilesecond(room_focus_min);
                let rest_sec = universal.minTransMilesecond(room_rest_min);

                //計算此教室目前時間在專注或休息中
                let modTime = (Date.now() - establish_time) % (focus_sec + rest_sec);
                if (modTime < focus_sec) {
                    lastTime = focus_sec - modTime;
                    state = true;//state為true表示專注中
                   
                } else if (modTime > focus_sec) {
                    lastTime = focus_sec + rest_sec - modTime;
                    state = false;
                   
                }
                result[t].state = state;
                result[t].lastTime = lastTime;

                //====================
            }
        } catch (error) {
            res.json({ "err:": err });
            console.log("err:" + error);
            return;
        }
        res.json({ errorCode: 200, data: { msg: "success", result: { room_info: result, contain: room_contain_array } } })
    });
}

//顯示此教室的資訊
const roomInfo = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_room = req.params.id_room;
    let rooms = "SELECT * FROM study_rooms WHERE id_room = " + id_room;
    try {
        res.json(await connect(rooms, null, 404, "StudyRoom doesn't exist"));
    } catch (error) {
        res.json(error);
    }
}

//原本要使用redis的sort來照教室人數作排列，但後來未成功，由前端去做排列
const rankContain = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_room = req.params.id_room;
    let arr = [];
    try {
        client.sort("id_room", "by", "contain_*", "get", "roomname_*", function (err, reply) {
            console.log(reply);
            client.sort("id_room", "by", "contain_*", "get", "contain_*", function (err, replyContain) {
                console.log(replyContain);
                client.sort("id_room", "by", "contain_*", function (err, replyId) {
                    console.log(replyId);
                    for (let i = 0; i < reply.length; i++) {
                        let id_room = replyId[i];
                        let roomname = reply[i];
                        let contain = replyContain[i];
                        let tmp = {
                            id_room,
                            roomname,
                            contain
                        }
                        arr.push(tmp);
                    }
                })
            })
            console.log(arr);
            res.json({ errorCode: 200, data: { msg: "success", result: { arr, err } } });
        });

    } catch (err) {
        res.json({ errorCode: 400, data: { msg: "success", result: { err } } });
    }


    // try {
    //     let rankname = await redisCommand.sort("id_room","contain_*","roomname_*");
    //     let rankid = await redisCommand.sort("id_room","contain_*","id_room");
    //     console.log(rankname);
    //     console.log(rankid);
    //     res.json({ errorCode: 200, data: { msg: "success", result: { rankname,rankid} } });
    // } catch (error) {
    //     res.json(error);
    // }
}

//當教室內人數為0就刪除教室
const closeRoom = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let sqlDelete = "DELETE FROM study_rooms WHERE id_room = ? ";
    let rooms = "SELECT * FROM study_rooms"
    con.query(rooms, async function (err, result) {
        if (result == "" | typeof result == "undefined" | err) {
            res.json({ errorCode: 400, data: { msg: "there is no studyroom ", result } })
            return;
        }
        console.log("result.length" + result.length);
        //取出redis對應id_roome的key，並回傳key裡有多少members作為自習室內人數
        try {
            for (let t = 0; t < result.length; t++) {
                console.log(result[t].id_room);
                // console.log("contain:" +await redisCommand.scard(result[t].id_room));
                let contain = await redisCommand.scard(result[t].id_room)
                if (contain == 0) {
                    await connect(sqlDelete, result[t].id_room, 400, "Fail To Delete");
                    continue;
                }
            }
        } catch (error) {
            res.json({ "err:": error });
            console.log("err:" + error);
            return;
        }
        res.json({ errorCode: 200, data: { msg: "success" } });
    });
}

//顯示教室內人數
const roomContain = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let members = [];
    let id_room = req.params.id_room;
    //注意未全選user table
    let sqlRoom = "SELECT s.*,u.name,u.img,u.introduction,u.registerDate FROM study_rooms s JOIN users u ON s.id_user = u.id_user AND id_room = " + id_room;

    try {


        //確認studyroom存在
        let roomResult = await connect(sqlRoom, null, 404, "StudyRoom doesn't exist");
        console.log(roomResult.data.result.length);

        //取得此教室(key)人數
        let contain = await redisCommand.scard(id_room);

        //將人數存入redis
        await redisCommand.set("contain_" + id_room, contain);

        //取得此教室(key)所有成員
        let result = await redisCommand.smembers(id_room);
        console.log(result);

        //將剛剛取得的成員轉成JSON存進陣列
        for (let i = 0; i < result.length; i++) {
            members.push(JSON.parse(result[i]));
        }
        console.log(members);
        res.json({
            errorCode: 200,
            data: {
                msg: "success",
                result: {
                    "room_info": roomResult.data.result[0],
                    "users": members,
                    contain: contain
                }
            }
        })
    } catch (error) {
        res.json(error);
    }
}


//進入教室
const entryRoom = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let members = [];
    let id_user = req.params.id;
    let id_room = req.params.id_room;
    let state = true;
    let nowMilesecond = new Date().getTime();
    //注意未全選user table
    let sqlUser = "SELECT id_user,name,registerDate,total_focus_time,img FROM users  WHERE id_user = " + mysql.escape(id_user);
    let sqlRoom = "SELECT s.*,u.name,u.img,u.introduction,u.registerDate FROM study_rooms s JOIN users u ON s.id_user = u.id_user AND id_room = " + id_room;


    try {
        //取得此使用者資料
        let userResult = await connect(sqlUser, null, 404, "wrong user");
        let user = userResult.data.result[0];

        //轉成string存進redis
        let userInfo = JSON.stringify(user, universal.dateTrans);
        console.log(userInfo);

        //確認studyroom存在
        let Result = await connect(sqlRoom, null, 404, "StudyRoom doesn't exist");
        console.log(Result.data.result.length);
        console.log(id_user + "sec:" + nowMilesecond);

        //計算下次回合時間
        let roomResult = Result.data.result;
        console.log("nextRoundTime" + roomResult);
        // let state = roomResult[0].state_of_concentration;
        let room_focus_min = roomResult[0].room_focus_min;
        let room_rest_min = roomResult[0].room_rest_min;
        let establish_time = roomResult[0].establish_time;
        console.log("room_focus_min:" + room_focus_min + "room_rest_min:" + room_rest_min + "next_ronud_time" + establish_time);
        let focus_sec = universal.minTransMilesecond(room_focus_min);
        let rest_sec = universal.minTransMilesecond(room_rest_min);
        let modTime = (Date.now() - establish_time) % (focus_sec + rest_sec);
        if (modTime < focus_sec) {
            lastTime = focus_sec - modTime;
            state = true;
            console.log("state:" + state + "lastTime" + lastTime);
        } else if (modTime > focus_sec) {
            lastTime = focus_sec + rest_sec - modTime;
            state = false;
            console.log("state:" + state + "lastTime" + lastTime);
        }

        // let roomState = {
        //     state,
        //     lastTime
        // }


        //將使用者存進redis的相對應教室key
        await redisCommand.sadd(id_room, userInfo);

        //將使用者與現在進入教室的毫秒時間存進redis
        client.hset("user", id_user, nowMilesecond);
        console.log(id_room)

        //取得此教室(key)人數
        let contain = await redisCommand.scard(id_room);

        //將人數存入redis
        await redisCommand.set("contain_" + id_room, contain);

        //取得此教室(key)所有成員
        let result = await redisCommand.smembers(id_room);
        console.log(result);

        //將剛剛取得的成員轉成JSON存進陣列
        for (let i = 0; i < result.length; i++) {
            members.push(JSON.parse(result[i]));
        }

        Result.data.result[0].state=state;
        Result.data.result[0].lastTime = lastTime;

        console.log(members);
        res.json({
            errorCode: 200,
            data: {
                msg: "success",
                result: {
                    "room_info": Result.data.result[0],
                 
                    "users": members,
                    contain: contain
                }
            }
        })
    } catch (error) {
        res.json(error);
    }
}

//離開教室
const leaveRoom = async function (req, res, next) {
    //判斷user
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_room = req.params.id_room;
    let sqlUser = "SELECT id_user,name,registerDate,total_focus_time,img FROM users  WHERE id_user = " + mysql.escape(id_user);
    let sqlUpdateTime = "UPDATE users SET total_focus_time = ? WHERE id_user = " + mysql.escape(id_user);

    try {
        //取得使用者資料，好從redis刪掉使用者
        let userResult = await connect(sqlUser, null, 404, "wrong user");
        let user = userResult.data.result[0];

        //將使用者資料轉成string
        let userInfo = JSON.stringify(user, universal.dateTrans);

        //取出entryroom時的時間毫秒
        let startTime = await redisCommand.hget("user", id_user);
        console.log(startTime);

        //總共進入教室時間 = 現在毫秒時間-entryroom時的毫秒時間
        let dif = new Date().getTime() - startTime;
        console.log(dif);


        //從redis刪除此使用者
        await redisCommand.srem(id_room, userInfo);
        await redisCommand.hdel("user", id_user);

        // //取得此教室(key)人數
        // let contain = await redisCommand.scard(id_room);
        // console.log("contain"+contain);

        // //將人數存入redis
        // await redisCommand.set("contain_" + id_room, contain);

        //如果總共進入教室時間<1分鐘
        if (dif < 60000) {
            res.json({ errorCode: 200, data: { msg: "success" } });
            return;
        }

        //取出使用者原本總共上線時間，換成毫秒
        let userTime = universal.timeTransMilesecond(user.total_focus_time);
        console.log(userTime);

        //加上此次進教室時間，轉成time格式
        onlineTime = universal.milesecondTransTime(dif + userTime);
        console.log(onlineTime);

        //update使用者總共上線時間
        res.json(await connect(sqlUpdateTime, onlineTime, 400, "Update Fail"));

    } catch (error) {
        res.json(error);
    }
}

//顯示教室內的question&reply
const showQA = async function (req, res, next) {
    // let id_user = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");
    let id_room = req.params.id_room;
    console.log("QA");
    let reply = [];
    // let sqlShowQuestion = 'SELECT * FROM questions q JOIN replies r USING(id_question) WHERE id_room = ' + id_room;

    let sqlShowQuestion = 'SELECT q.*,u.name,u.img FROM questions q JOIN users u ON q.id_question_user = u.id_user WHERE id_room = ' + id_room;
    // let sqlShowReply = 'SELECT r.*,u.name,u.img FROM replies r JOIN users u ON r.id_reply_user = u.id_user WHERE id_question = ?';

    try {
        let resultQ = await connect(sqlShowQuestion, null, 404, "There Are No Question Yet");

        let allQuestion = resultQ.data.result;

        for (let i = 0; i < allQuestion.length; i++) {
            let id_q = allQuestion[i].id_question;
            // let sqlReply = sql.select("*").from("replies").where("id_question = " + id_q).gen();
            let sqlReply = 'SELECT r.*,u.name,u.img FROM replies r JOIN users u ON r.id_reply_user = u.id_user WHERE id_question = ' + id_q;

            // connect(sqlShowReply,id_q,404,"no reply");
            let resultR = await universal.connect(sqlReply);
            // console.log(resultR.data.result);
            reply = [];
            reply = resultR;
            allQuestion[i].reply = reply;
        }

        console.log(allQuestion);
        res.json({ errorCode: 200, data: { msg: "success", result: allQuestion } });
    } catch (error) {
        res.json(error);
    }

}

//隨機從教室內的人抓一個成為builder(室長)
const changeBuilder = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_user = req.params.id;
    let id_room = req.params.id_room;
    let sqlUpdateRoomUser = 'UPDATE study_rooms SET id_user = ? WHERE id_room = ?';
    let sqlDelete = "DELETE FROM study_rooms WHERE id_room = ? ";
    //取得此教室(key)所有成員
    try {
        let result = await redisCommand.smembers(id_room);
        if (result == "") {
            console.log("SSS");
            return res.json(await connect(sqlDelete, id_room, 400, "Fail To Delete"));

        }
        console.log(result);
        let position = Math.floor(Math.random() * (result.length - 1));
        let builder = JSON.parse(result[position]);
        console.log(builder + "id" + position);
        let builderID = builder.id_user;

        await connect(sqlUpdateRoomUser, [builderID, id_room], 400, "Fail To Change");

        res.json({ errorCode: 200, data: { msg: "change builder success", builder } });
    } catch (error) {
        res.json(error);
    }
}

//回傳教室下一個回合開始時間，與目前教室state
const nextRoundTime = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let id_room = req.params.id_room;
    let sqlRoom = 'SELECT * FROM study_rooms WHERE id_room = ' + id_room;
    let sqlUpdateRoom = 'UPDATE study_rooms SET state_of_concentration = ?  WHERE id_room = ?';
    let lastTime = 0;
    let state =true;
    try {

        let result = await connect(sqlRoom, null, 404, "StudyRoom doesn't exist");
        let roomResult = result.data.result;
        console.log("nextRoundTime" + roomResult);
        // let state = roomResult[0].state_of_concentration;
        let room_focus_min = roomResult[0].room_focus_min;
        let room_rest_min = roomResult[0].room_rest_min;
        let establish_time = roomResult[0].establish_time;
        console.log("room_focus_min:" + room_focus_min + "room_rest_min:" + room_rest_min + "next_ronud_time" + establish_time);
        let focus_sec = universal.minTransMilesecond(room_focus_min);
        let rest_sec = universal.minTransMilesecond(room_rest_min);

        let modTime = (Date.now() - establish_time) % (focus_sec + rest_sec);


        if (modTime < focus_sec) {
            lastTime = focus_sec - modTime;
            state = true;
            // console.log("state:" + state + "lastTime" + lastTime);
        } else if (modTime > focus_sec) {
            lastTime = focus_sec + rest_sec - modTime;
            state = false;
            // console.log("state:" + state + "lastTime" + lastTime);
        }

        let roomState = {
            state,
            lastTime
        }       
        res.json({ errorCode: 200, data: { msg: "success", result: roomState } });

    } catch (error) {
        res.json(error);
    }
}




module.exports = {
    addRoom,
    roomlist,
    closeRoom,
    entryRoom,
    leaveRoom,
    showQA,
    roomInfo,
    rankContain,//失敗
    roomSetting,
    changeBuilder,
    roomContain,
    nextRoundTime
};