const connect = require('../config/connect');


//設定自己的番茄鐘，已棄用，改成room內新增自習室時須設定

const addPomodoro = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    let id_user = req.params.id;
    // let date_time = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString();
    let pomodoros = [];
    let base = [];
    let start_date_time = req.body.start_date_time;
    let end_date_time = req.body.end_date_time;
    let id_pomodoro = req.body.id_pomodoro;
    let focus_min = req.body.focus_min;
    let round = req.body.round;
    let distractions_count = req.body.distractions_count;
    let distraction = req.body.distraction;
    let value = [[[id_pomodoro, id_user, start_date_time, end_date_time, focus_min, round, distractions_count]]];

    let sql = "INSERT INTO pomodoros VALUES ?";
    let distractions = "INSERT INTO distractions(id_pomodoro,distraction_round,distraction_time) VALUES ?";
    try {
        let all = await connect(sql, value, 400, "insert fail");
        if (distraction != null) {
            console.log(distraction.length);
            for (i = 0; i < distraction.length; i++) {
                let query = [all.data.result.insertId, distraction[i].round, distraction[i].min + ":" + distraction[i].sec];
                pomodoros.push(query);
            }
            base.push(pomodoros);
            console.log(all);

            res.json(await connect(distractions, base, 400, "insert fail"));
            return;
        }
        res.json(all);
    } catch (error) {
        res.json(error);
    }

}


const deletePomodoro = async function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    let id_pomodoro = req.params.id_pomodoro;
    let sql = "DELETE FROM pomodoros WHERE id_pomodoro = ? ";

    try {

        res.json(await connect(sql, [id_pomodoro], 400, "fail to delete"))
    } catch (error) {
        res.json(error);
    }
}

module.exports = {
    addPomodoro,
    deletePomodoro
}

