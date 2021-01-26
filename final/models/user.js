const con = require('../app/con');
const Schema = mysql.Schema;

const userSchema = new Schema({
    account: {type: String, required:true},
    password: {type: String, required:true},
    name: {type: String, required:true},  

})
var sql = "use test1_schema";
module.exports = con.query(sql,function (err, result) {
    if (err) throw err;		//拋出錯誤
    console.log("used");
});