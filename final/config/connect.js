const con = require('../config');


let connect = function (sqlString, values, errorCode, errorMsg) {
    if (values != null) {
        for (let i = 1; i < connect.arguments.length - 2; i++) {
            var value = connect.arguments[i];
            console.log(value);
        }
    }

    return new Promise((res, rej) => {
        con.query(sqlString, value, function (error, result) {

            if (error) {
                if (error.errno == 1062) {
                    console.log("error1062");
                
                    rej({ errorCode: errorCode, data: { msg: "error1062", error } });
                    return;
                }

                console.log("error");
                rej({ errorCode: errorCode, data: { msg: "error", error } });
                return;
            }
            if (result == '' | typeof result == 'undefined' | result.affectedRows == 0) {
                console.log("errMsg");
                rej({ errorCode: errorCode, data: { msg: 'error', errorMsg } });
                return;
            }
            else {
                console.log("result:" + result);
                res({ errorCode: 200, data: { msg: "success", result } });
            }
        })
    })
}

// res({ errorCode: 200, msg: ({ "success:":result }) });

//插入一個問號多個值
// let sql = "INSERT INTO pomodoros VALUES ?";
// let value = [[[id_pomodoro, id_user, date_time, focus_min, round, distractions_count]]];
// let all = await connect(sql, value, 400, "insert fail");
// let query = [all.msg.result.insertId, distraction_round[i], distraction_time[i]];
// res.json(query);

//插入兩個問號
// let id_user = req.params.id;
// let id_message = req.params.id_message;
// let sql = 'DELETE FROM messages WHERE id_message = ? AND id_user = ? ' ;
// try {
//     res.json(await connect(sql, [id_message,id_user],404, "You Are Not the User"));
// } catch (error) {
//     res.json(error);
// }



module.exports = connect;