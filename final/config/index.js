const mysql = require("mysql");


var con = mysql.createConnection({
    // host: "127.0.0.1",    
    host: "104.199.230.53",    
    user: "root",
    password: "n331437xu",
    port: 3306,
    database: "test1_schema",
    timezone: "08:00"
  });


  module.exports =  con;
 
  