const main = (req, res, next) => {
    res.render('index', { title: 'Express' })
}
const register = (req, res, next) => {
    res.render('register', { title: 'Express' })
}
const studyRoom = (req, res, next) => {
    res.render('studyRoom', { title: 'Express' })
}
const mesBoard= (req, res, next) => {
    res.render('mesBoard', { title: 'Express' })
}

// const 
// con = req.con;
// var sql = "use new_schema;";
// con.query(sql, function (err, result) {
//     if (err) throw err;		//拋出錯誤
//     console.log("used");
// });

module.exports = {
    main,
    register,
    studyRoom,
    mesBoard
};