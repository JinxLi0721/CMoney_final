const redis = require("redis");
// 端口、IP、密码
const client = redis.createClient(6379, '127.0.0.1');
// const client = redis.createClient(6379, '35.229.219.152');

// client.on("error", function(error) {
//     console.error(error);
//   });

  module.exports =  client;